/**
 * Valid order states
 * Used for validation and state routing in order sagas
 */
export const ORDER_STATES = {
  PURCHASE: 'Compra',
  WAITING_DISPATCH: 'EsperaDespacho',
  WAITING_DEPARTURE: 'EsperaSalida',
  ACCEPTED: 'Aceptada',
  DEPARTURE: 'Salida',
  DELIVERED: 'Entregada',
  REJECTED: 'Rechazada',
};

/**
 * Order state routing: which page/tab should a user see after state change
 * Fail-safe: if state not recognized, returns default
 */
export const getOrderStateRoute = (orderState) => {
  switch (orderState) {
    case ORDER_STATES.PURCHASE:
      return { page: '/company/orders', tab: '1' };
    case ORDER_STATES.WAITING_DISPATCH:
      return { page: '/company/orders', tab: '2' };
    case ORDER_STATES.WAITING_DEPARTURE:
    case ORDER_STATES.ACCEPTED:
    case ORDER_STATES.DEPARTURE:
      return { page: '/company/vueltas', tab: null };
    case ORDER_STATES.DELIVERED:
    case ORDER_STATES.REJECTED:
      return { page: '/company/orders', tab: '1' };
    default:
      // Fail-closed: unknown state defaults to orders list
      console.warn(`Unknown order state: ${orderState}`, 'defaulting to orders list');
      return { page: '/company/orders', tab: '1' };
  }
};

/**
 * Safely get orderState from a data object
 * Handles nested structures: data.orderState or data[0]?.order?.orderState
 * @param {any} data - Data object from API response
 * @param {string} defaultValue - Default value if extraction fails
 * @returns {string} orderState value or default
 */
export const getOrderState = (data, defaultValue = null) => {
  if (!data) return defaultValue;

  // Case 1: Direct orderState (simple response)
  if (typeof data.orderState === 'string') {
    return data.orderState;
  }

  // Case 2: Array with nested order structure (massive operations)
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    if (firstItem?.order?.orderState && typeof firstItem.order.orderState === 'string') {
      return firstItem.order.orderState;
    }
  }

  // Fallback
  return defaultValue;
};

/**
 * Validate if a state value is a recognized order state
 * @param {string} state - State to validate
 * @returns {boolean}
 */
export const isValidOrderState = (state) => {
  return Object.values(ORDER_STATES).includes(state);
};
