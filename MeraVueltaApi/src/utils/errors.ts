/** Errors to throw in the APIs */
export enum ErrorMessages {
  // User
  ERROR_LOGIN = 'No se pudo iniciar sesión',
  ERROR_REGISTER = 'No se pudo registrar',
  ERROR_USER_NOT_FOUND = 'No se encontró el usuario',
  ERROR_USER_COMPANY_NOT_FOUND = 'No se encontró la compañía',
  ERROR_USER_DOMICILIARY_NOT_FOUND = 'No se encontró el domiciliario',

  // Order
  ERROR_ORDER_NOT_FOUND = 'No se encontró el pedido',
  ERROR_ORDER_UNEXPECTED = 'Se produjo un error inesperado',
  ERROR_ORDER_CREATE = 'No se pudo crear el pedido',
  ERROR_ORDER_UPDATE = 'No se pudo actualizar el pedido',
  ERROR_ORDER_DELETE = 'No se pudo eliminar el pedido',
  ERROR_ORDER_READY_EXIST = 'No se pudo crear el pedido, ya existe uno con ese número de entrega',
  ERROR_ORDER_EXIST = 'No se pudo crear el pedido, ya existe uno con ese número de pedido',

  // Order Sheets
  ERROR_ORDER_SHEET_NOT_FOUND = 'No se encontró el pedido',
  ERROR_ORDER_SHEET_UNEXPECTED = 'Se produjo un error inesperado en google sheets',

  // PositionUser
  ERROR_POSITION_NOT_FOUND = 'No se pudo encontró la posición',
  ERROR_POSITION_UNEXPECTED = 'Se produjo un error inesperado',

  // whatsapp
  ERROR_WHATSAPP_NOT_FOUND = 'No se pudo encontró el whatsapp',
  ERROR_WHATSAPP_UNEXPECTED = 'Se produjo un error inesperado',

  // DomiciliaryCompany
  ERROR_DOMICILIARY_COMPANY_NOT_FOUND = 'No se pudo encontró la empresa domiciliaria',
  ERROR_DOMICILIARY_COMPANY_UNEXPECTED = 'Se produjo un error inesperado',
  ERROR_DOMICILIARY_COMPANY_EXIST = 'Ya existe una empresa domiciliaria con ese nombre',
  ERROR_DOMICILIARY_COMPANY_ALREADY_EXIST = 'Ya existe una empresa domiciliaria con ese nombre',

  // Customer
  ERROR_CUSTOMER_NOT_FOUND = 'No se pudo encontró el cliente',
  ERROR_CUSTOMER_UNEXPECTED = 'Se produce un error inesperado',
  ERROR_CUSTOMER_ALREADY_EXIST = 'Ya existe un cliente con ese numero de celular',

  // DomiciliaryCompanyRequest
  ERROR_DOMICILIARY_COMPANY_REQUEST_NOT_FOUND = 'No se pudo encontró la solicitud de empresa domiciliaria',
  ERROR_DOMICILIARY_COMPANY_REQUEST_UNEXPECTED = 'Se produjo un error inesperado',
  ERROR_DOMICILIARY_COMPANY_REQUEST_EXIST = 'Ya existe una solicitud de empresa domiciliaria con ese nombre',

  // CRUD google sheets
  ERROR_GOOGLE_SHEETS_NOT_FOUND = 'No se pudo encontró el valor en la hoja',
  ERROR_GOOGLE_SHEETS_UNEXPECTED = 'Se produjo un error inesperado',
  ERROR_GOOGLE_SHEETS_EXIST = 'Ya existe orden en google sheets con ese número de compra',
  ERROR_GOOGLE_SHEETS_NOT_EXIST_URL = 'No existe la URL de la hoja de google',

  // Wpp
  ERROR_WPP_NOT_FOUND = 'No se pudo encontró el valor en la hoja',
  ERROR_WPP_UNEXPECTED = 'Se produjo un error inesperado',

  //Wompiser
  DECLINED = 'La transacción fue rechazada, revisa tu correo para más información',
  EXPIRED = 'La transacción expiró',
  ERROR_USER_CLIENT_NOT_FOUND = 'Aun no eres cliente, por favor regístrate para continuar creando ordenes',
  ERROR_USER_NOT_PAY = 'Plan agotado, se renovara tu suscripción, intenta mas tarde',
  ERROR_USER_NOT_PAY_DOMICILIARY = 'Has copado el cupo de domiciliarios, por favor aumenta tu plan o elimina domiciliarios',
  ERROR_WOMPI_TOKEN = 'Fallo el obtener el token',
  ERROR_WOMPI_ERROR = 'Fallo el pago',
  ERROR_WOMPI_NOT_FOUND = 'No tienes una subscription activa',
  ERROR_TOKEN_AUTH = 'No se pudo autenticar el token',
  ERROR_TOKEN_NOT_FOUND = 'No se pudo encontrar el token',
  ERROR_PLAN_NOT_FOUND = 'No se pudo encontrar el plan',
}
