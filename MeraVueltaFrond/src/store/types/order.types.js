/**
 * Order data types (JSDoc for runtime validation guidance)
 * Este archivo documenta la estructura esperada de órdenes del backend
 * para que el frontend pueda validar y acceder con seguridad
 */

/**
 * @typedef {Object} Order
 * @property {number|string} deliveryNumber - Número único de entrega
 * @property {number|string} purchaseNumber - Número de compra
 * @property {string} name - Nombre del cliente
 * @property {string} lastName - Apellido del cliente
 * @property {string} clientPhone - Teléfono cliente
 * @property {string} prefix - Prefijo país
 * @property {string} orderState - Estado de la orden (ver ORDER_STATES)
 * @property {Date|string} creationDate - Fecha de creación
 * @property {Date|string} updatedAt - Última actualización
 * @property {string} [deliveryAddress] - Dirección de entrega
 * @property {string} [pickupAddress] - Dirección de recolección
 * @property {string} [geolocationDelivery] - Geolocalización entrega (JSON string)
 * @property {string} [pickupLocation] - Ubicación recolección (JSON string)
 * @property {string} [department] - Departamento
 * @property {string} [city] - Ciudad
 * @property {string} [neighborhood] - Barrio
 * @property {string} [residentialGroupName] - Nombre conjunto residencial
 * @property {string} [houseNumberOrApartment] - Número casa/apartamento
 * @property {string} [deliveryPacket] - Paquete a entregar
 * @property {string} [deliveryNote] - Nota de entrega
 * @property {string} [paymentMethod] - Método de pago
 * @property {string} [email] - Email cliente
 * @property {string} [documentNumber] - Número documento
 * @property {string} [typeDocument] - Tipo documento
 * @property {string} [pickupTime] - Hora recolección
 * @property {string} [dealerNote] - Nota distribuidor
 * @property {string} [pickupPicture] - URL foto recolección
 * @property {Object} [domiciliary] - Domiciliario asignado
 * @property {string} [domiciliary.name] - Nombre domiciliario
 */

/**
 * @typedef {Object} OrderMassiveResponse
 * @property {string} status - Estado de la operación (p.ej. "creada", "error")
 * @property {Order} order - Orden procesada
 */

/**
 * Validar que un objeto tiene la estructura mínima de una Order
 * @param {any} obj - Objeto a validar
 * @returns {boolean}
 */
export const isValidOrder = (obj) => {
  if (!obj || typeof obj !== 'object') return false;

  // Validaciones mínimas para identificar como Order
  return (
    (typeof obj.deliveryNumber !== 'undefined' || typeof obj.purchaseNumber !== 'undefined') &&
    typeof obj.orderState === 'string'
  );
};

/**
 * Validar estructura de respuesta de operación masiva
 * @param {any} response - Respuesta a validar
 * @returns {boolean}
 */
export const isValidOrderMassiveResponse = (response) => {
  if (!Array.isArray(response)) return false;
  if (response.length === 0) return true; // Array vacío es válido

  return response.every(item =>
    item && typeof item === 'object' &&
    typeof item.status === 'string' &&
    item.order && isValidOrder(item.order)
  );
};

/**
 * Extraer de forma segura el campo orderState de cualquier estructura
 * @param {any} data - Datos del API response
 * @returns {string|null}
 */
export const safeGetOrderState = (data) => {
  if (!data) return null;

  // Simple order response
  if (typeof data.orderState === 'string') {
    return data.orderState;
  }

  // Massive operation response (array of {status, order})
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (first?.order?.orderState && typeof first.order.orderState === 'string') {
      return first.order.orderState;
    }
  }

  return null;
};

/**
 * Extraer de forma segura el campo deliveryNumber
 * @param {any} data - Datos a extraer
 * @returns {string|number|null}
 */
export const safeGetDeliveryNumber = (data) => {
  if (!data) return null;
  if (typeof data.deliveryNumber !== 'undefined') {
    return data.deliveryNumber;
  }
  if (Array.isArray(data) && data.length > 0 && typeof data[0]?.order?.deliveryNumber !== 'undefined') {
    return data[0].order.deliveryNumber;
  }
  return null;
};
