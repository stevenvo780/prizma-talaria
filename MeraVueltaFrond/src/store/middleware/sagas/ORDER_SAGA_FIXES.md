# Order Saga Defensas y Mejoras

## Problema Original
Los sagas de órdenes accedían a la estructura de datos sin validación, causando potenciales crashes si:
1. `data.orderState` era undefined o null
2. `data[0]?.order?.orderState` fallaba por estructura inesperada del API
3. Estados desconocidos no eran manejados (typos, nuevos estados del backend)

## Soluciones Implementadas

### 1. **orderConstants.js** — Fuente única de verdad para estados
- `ORDER_STATES` enum: define todos los estados válidos (Compra, EsperaDespacho, etc.)
- `getOrderState()`: extrae de forma segura orderState de cualquier estructura (simple o masiva)
- `getOrderStateRoute()`: mapea orderState → página + tab con fallback defensivo
- `isValidOrderState()`: valida que un estado es reconocido

### 2. **updateOrderSaga** — Routing defensivo
**Antes:**
```javascript
if (data.orderState === 'Compra') { /* 30 líneas de if anidados */ }
```

**Después:**
```javascript
const orderState = getOrderState(data);
if (!orderState || !isValidOrderState(orderState)) return;
const route = getOrderStateRoute(orderState);
yield put(push(route.page));
```

**Beneficios:**
- Fail-safe: si backend retorna estado desconocido, loguea warning pero no crashea
- DRY: routing centralizado en `getOrderStateRoute()`
- Soporta "Rechazada" automáticamente (agregado a ORDER_STATES)

### 3. **deleteOrderSaga** — Protección contra data corrupta
- Valida `orderState` antes de usar en switch
- Fallback a /company/orders si data está vacía o malformada

### 4. **deleteMassiveOrdersSaga** — Manejo de arrays
**Antes:**
```javascript
if (data?.length > 0 && data[0]?.order?.orderState) { /* múltiples if */ }
```

**Después:**
```javascript
const orderState = getOrderState(data);  // Maneja array[0].order.orderState internamente
if (orderState && isValidOrderState(orderState)) {
  const route = getOrderStateRoute(orderState);
  // ...
} else if (Array.isArray(data) && data.length === 0) {
  // Fallback para array vacío
  yield put(push('/company/orders'));
}
```

### 5. **updateOrderMassiveSaga** — Mismo patrón defensivo
- Usa `getOrderState()` para extraer de array masivo
- Fallback a /company/orders si es array vacío
- Logs warnings en casos de estado desconocido

### 6. **ModalsOrder.jsx** — Validación en componentes
- Guard defensivo en `ModalDetailOrder`: valida que `order` es objeto válido
- `state()` function reconoce "Rechazada" y casos edge
- Fallback a "Estado desconocido" si order es null/undefined

### 7. **order.types.js** — Documentación de tipos (JSDoc)
- Define estructura esperada de Order con campos opcionales
- `isValidOrder()`: valida estructura mínima
- `safeGetOrderState()`, `safeGetDeliveryNumber()`: extractores defensivos
- Sirve como referencia para qué espera el frontend del backend

## Estados Soportados
```javascript
ORDER_STATES = {
  PURCHASE: 'Compra',
  WAITING_DISPATCH: 'EsperaDespacho',
  WAITING_DEPARTURE: 'EsperaSalida',
  ACCEPTED: 'Aceptada',
  DEPARTURE: 'Salida',
  DELIVERED: 'Entregada',
  REJECTED: 'Rechazada',  // ← NUEVO, soportado por ListOrdersDomiciliary.jsx
}
```

## Validación Defensiva contra Cambios Backend
Si el backend retorna:
- **Estado nuevo (typo o cambio)**: se loguea warning, user va a /company/orders default
- **Data vacía**: fallback a orders list
- **Data malformada**: no crashea, muestra warning y UI por defecto
- **orderState faltando**: se trata como fallback a estado por defecto

## Pruebas Recomendadas
1. **Unit test**: `getOrderState()` con datos simples y masivos
2. **Unit test**: `isValidOrderState()` con estados válidos e inválidos
3. **E2E**: Reject order → validar que UI muestra "Rechazada" y saga rouquea correctamente
4. **E2E**: Backend retorna estado desconocido → UI no crashea, muestra warning
5. **E2E**: API retorna array vacío en masivas → fallback a orders list

## Integración con Backend
El backend debe:
1. Retornar `orderState: 'Rechazada'` cuando domiciliario rechaza
2. Validar que solo estados en `ORDER_STATES` sean guardados
3. Emitir eventos Hub para estado "Rechazada" (si es requerido)
4. Notificar al comprador cuando su orden es rechazada

Vea: `/workspace/Prizma/apps/talaria/MeraVueltaApi/` para endpoints de órdenes.
