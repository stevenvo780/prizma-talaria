/**
 * Olympo integration — MeraVuelta API.
 *
 * Cablea `@olympo/contracts` para que este servicio publique al HubCentral los
 * eventos de los que es DUEÑO según la matriz SSOT (ARCHITECTURE.md §4-5):
 *   - delivery (MeraVuelta es SSOT del estado de entrega).
 *
 * El `HubClient` es tolerante a fallos por diseño (principio: los conectores son
 * opcionales). Un publish fallido NO lanza hacia la lógica de negocio salvo que
 * `throwOnError` esté activo, así que las llamadas pueden hacerse "fire-and-forget".
 *
 * Config por entorno:
 *   - CAUCE_HUB_URL     → URL del HubCentral (default http://localhost:3007).
 *   - CAUCE_HUB_SECRET  → secret HMAC compartido para firmar el envelope (opcional).
 */
import { HubClient, EVENTS, validateEvent, type EventEnvelope } from '@olympo/contracts';

/** Cliente Hub configurado como source="meravuelta". */
export const hub = new HubClient({
  source: 'meravuelta',
  hubUrl: process.env.CAUCE_HUB_URL,
  secret: process.env.CAUCE_HUB_SECRET,
  // throwOnError omitido a propósito: queremos que un fallo del Hub no tumbe la entrega.
});

/** Re-exports útiles para los call-sites. */
export { EVENTS, validateEvent };
export type { EventEnvelope };

/**
 * Helper interno: valida el payload contra el schema Zod del evento antes de
 * publicar. Si no valida, registra y NO publica (evita basura en el Hub) sin
 * romper el flujo local.
 */
async function safePublish(
  eventType: string,
  data: Record<string, unknown>,
  priority?: EventEnvelope['priority'],
): Promise<boolean> {
  const check = validateEvent({
    eventId: 'pre',
    eventType,
    timestamp: new Date().toISOString(),
    source: 'meravuelta',
    data,
    priority: priority || 'normal',
  } as EventEnvelope);
  if (!check.ok) {
    console.warn(`[cauce] payload inválido para "${eventType}", no se publica:`, check.error);
    return false;
  }
  return hub.publish(eventType, data, priority ? { priority } : {});
}

/**
 * delivery.created — una entrega quedó registrada en MeraVuelta.
 * Flujo 7 (ARCHITECTURE.md §4).
 */
export function publishDeliveryCreated(input: {
  deliveryId: string;
  orderId: string;
}): Promise<boolean> {
  return safePublish(EVENTS.DELIVERY_CREATED, {
    deliveryId: input.deliveryId,
    orderId: input.orderId,
  });
}

/**
 * delivery.status_update — cambió el estado de una entrega (tracking).
 * `status` se normaliza al enum del contrato: assigned | picked_up | in_transit |
 * delivered | failed.
 */
export function publishDeliveryStatusUpdate(input: {
  deliveryId: string;
  status: string;
  lat?: number;
  lng?: number;
}): Promise<boolean> {
  return safePublish(EVENTS.DELIVERY_STATUS_UPDATE, {
    deliveryId: input.deliveryId,
    status: mapStatusToContract(input.status),
    ...(input.lat != null ? { lat: input.lat } : {}),
    ...(input.lng != null ? { lng: input.lng } : {}),
  });
}

/**
 * delivery.completed — la entrega llegó a destino.
 * Flujo 7 (ARCHITECTURE.md §4).
 */
export function publishDeliveryCompleted(input: {
  deliveryId: string;
  orderId: string;
  at?: string;
}): Promise<boolean> {
  return safePublish(
    EVENTS.DELIVERY_COMPLETED,
    {
      deliveryId: input.deliveryId,
      orderId: input.orderId,
      at: input.at || new Date().toISOString(),
    },
    'high',
  );
}

/**
 * Traduce los estados internos de MeraVuelta (orderState en español) al enum
 * que define `@olympo/contracts` para delivery.status_update.
 */
export function mapStatusToContract(
  internalStatus: string,
): 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' {
  switch (internalStatus) {
    case 'Compra':
    case 'En_preparacion':
      return 'assigned';
    case 'Lista_para_envio':
      return 'picked_up';
    case 'En_camino':
      return 'in_transit';
    case 'Entregado':
      return 'delivered';
    case 'Devuelto':
    case 'Cancelado':
      return 'failed';
    default:
      return 'assigned';
  }
}

/** ¿Este estado interno significa "entrega completada"? */
export function isCompletedStatus(internalStatus: string): boolean {
  return internalStatus === 'Entregado';
}
