/**
 * Prizma Payments — Talaria API (Mercado Pago, cuenta CENTRAL).
 *
 * Wrapper sobre `prizma-payments` (MercadoPagoGateway). Reemplaza la integración
 * directa con Wompi del módulo PayUsers.
 *
 * DISEÑO LAZY (no rompe el boot sin credenciales): el gateway se instancia una
 * sola vez y NO valida el token en el constructor; sólo falla en runtime cuando
 * se intenta cobrar/consultar sin `MP_ACCESS_TOKEN`. Así la app arranca aunque
 * el owner cargue los secretos después.
 *
 * Cuenta CENTRAL: sin OAuth, sin credenciales por tienda. Un único access token.
 *
 * Env:
 *   - MP_ACCESS_TOKEN     → token de la cuenta central (cobros/consultas).
 *   - MP_PUBLIC_KEY       → clave pública (front; no usada aquí pero documentada).
 *   - MP_WEBHOOK_SECRET   → firma x-signature de los webhooks MP (los recibe el Hub).
 *   - PRIZMA_HUB_WEBHOOK_URL → notification_url ÚNICA del Hub para TODO pago/suscripción.
 */
import { MercadoPagoGateway } from 'prizma-payments';

/**
 * Webhook ÚNICO del Hub para TODO pago/suscripción de MP (cuenta central).
 * Toda PreApproval/Checkout de Talaria registra esta `notification_url`; el Hub
 * valida la firma, consulta el pago y nos reenvía `suscripcion.activada` /
 * `pago.aprobado` al inbound handler (`/api/webhooks/payments`).
 */
export const HUB_MP_WEBHOOK_URL =
  process.env.PRIZMA_HUB_WEBHOOK_URL ||
  'https://prizma-nous-578238159459.us-central1.run.app/webhooks/mercadopago';

/** Gateway perezoso: construido sin token; falla sólo al cobrar/consultar. */
export const mpGateway = new MercadoPagoGateway();

/** Prefijo de `externalReference` para suscripciones de plan: `talaria:plan:<userId>`. */
export function planExternalReference(userId: number | string): string {
  return `talaria:plan:${userId}`;
}
