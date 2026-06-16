import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import { verifySignature } from 'prizma-contracts';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/users';

/**
 * Inbound payments webhook — recibe del Hub los eventos de ciclo de vida de
 * pasarela (Mercado Pago, cuenta central) que activan/desactivan el plan.
 *
 * El Hub procesa el webhook único de MP, valida la firma `x-signature`, consulta
 * el pago/suscripción y nos reenvía un evento de contrato firmado a:
 *   POST /api/webhooks/payments
 * con:
 *   - header `x-prizma-signature` (HMAC del body con el hub secret),
 *   - header `x-idempotency-key` (= `mp:<mpId>:<eventType>`),
 *   - header `x-prizma-event` (= eventType),
 *   - body `{ eventType, ...payloadDeContrato }` (incluye `externalReference`).
 *
 * eventType relevantes para Talaria:
 *   - `suscripcion.activada`  → PreApproval `authorized` → activa el plan.
 *   - `suscripcion.cancelada` → PreApproval cancelada/pausada → desactiva.
 *   - `pago.aprobado`         → cobro puntual aprobado (revalida el plan).
 *   - `pago.rechazado`        → cobro rechazado (marca PENDING/DECLINED).
 *
 * Convención de `externalReference`: `talaria:plan:<userId>`.
 */

// Dedupe en memoria por idempotency-key. Suficiente para un solo proceso; si se
// escala a varias réplicas, mover a Postgres/Redis (la idempotencia real la
// garantiza también el Hub aguas arriba).
const processedKeys = new Set<string>();

/** Extrae el `userId` de `talaria:plan:<userId>`. Devuelve null si no encaja. */
function userIdFromExternalReference(externalReference: string | undefined): number | null {
  if (!externalReference) return null;
  const parts = externalReference.split(':');
  // [producto, kind, ...id]
  if (parts.length < 3) return null;
  if (parts[0] !== 'talaria') return null;
  const id = Number(parts.slice(2).join(':'));
  return Number.isFinite(id) ? id : null;
}

export async function receivePaymentEvent(
  req: Hapi.request,
  h: Hapi.ResponseToolkit,
): Promise<Hapi.ResponseObject | Boom.Boom> {
  const signature = req.headers['x-prizma-signature'] as string | undefined;
  const idempotencyKey = req.headers['x-idempotency-key'] as string | undefined;
  const secret = process.env.NOUS_HUB_SECRET || '';

  // Verificación de firma PRIMERO (fail-closed si hay secreto configurado).
  // Se hace antes de tocar la conexión a BD para que una petición sin firma sea
  // rechazada con 401 aunque la BD esté caída — y para no exponer un 500 de boot
  // como superficie. (Antes este handler leía `connection.manager` en la primera
  // línea y crasheaba con 500 si la conexión no estaba lista.)
  if (secret) {
    if (!verifySignature(req.payload, signature, secret)) {
      console.error('[talaria] firma de webhook de pagos inválida');
      return Boom.unauthorized('Firma inválida');
    }
  }

  // La conexión puede no estar lista si la BD falló al arrancar (el boot es
  // resiliente y no lanza). Devolvemos 503 explícito en vez de un TypeError 500.
  const connection = req.server.app.connection;
  if (!connection) {
    console.error('[talaria] conexión a BD no disponible al procesar evento de pago');
    return Boom.serverUnavailable('Base de datos no disponible');
  }
  const manager: EntityManager = connection.manager;

  // Idempotencia.
  if (idempotencyKey) {
    if (processedKeys.has(idempotencyKey)) {
      return h.response({ ok: true, deduped: true }).code(200);
    }
    processedKeys.add(idempotencyKey);
  }

  const body = req.payload as Record<string, unknown>;
  const eventType = (body.eventType as string) || (req.headers['x-prizma-event'] as string);
  const externalReference = body.externalReference as string | undefined;
  const userId = userIdFromExternalReference(externalReference);

  if (userId == null) {
    // No es un evento de plan de Talaria que podamos enrutar; 200 para no
    // provocar reintentos del Hub, pero no mutamos nada.
    console.warn(`[talaria] evento de pago sin externalReference de plan válido: ${externalReference}`);
    return h.response({ ok: true, ignored: true }).code(200);
  }

  const user = await manager.findOne(User, { where: { id: userId } });
  if (!user) {
    console.warn(`[talaria] evento de pago para usuario inexistente: ${userId}`);
    return h.response({ ok: true, ignored: true }).code(200);
  }

  let subscription = await manager.findOne(Subscription, { where: { user: userId } });
  if (!subscription) {
    subscription = new Subscription();
    subscription.createdAt = new Date();
    subscription.user = user;
    subscription.externalReference = externalReference || '';
  }

  switch (eventType) {
  case 'suscripcion.activada':
  case 'pago.aprobado': {
    subscription.valid = true;
    subscription.status = 'APPROVED';
    const plan = body.plan as string | undefined;
    if (plan) subscription.plan = plan;
    const mpPreapprovalId = body.mpPreapprovalId as string | undefined;
    if (mpPreapprovalId) subscription.preapprovalId = mpPreapprovalId;
    subscription.createdAt = new Date();
    await manager.save(subscription);
    console.log(`[talaria] plan activado para usuario ${userId} (${eventType})`);
    break;
  }
  case 'suscripcion.cancelada': {
    subscription.valid = false;
    subscription.status = 'DECLINED';
    await manager.save(subscription);
    console.log(`[talaria] suscripción cancelada para usuario ${userId}`);
    break;
  }
  case 'pago.rechazado': {
    subscription.valid = false;
    subscription.status = 'PENDING';
    await manager.save(subscription);
    console.log(`[talaria] pago rechazado para usuario ${userId}`);
    break;
  }
  default:
    console.warn(`[talaria] eventType de pago no manejado: ${eventType}`);
    return h.response({ ok: true, ignored: true }).code(200);
  }

  return h.response({ ok: true }).code(200);
}
