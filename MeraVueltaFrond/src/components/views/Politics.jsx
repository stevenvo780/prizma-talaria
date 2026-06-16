import React from 'react';

const Politics = () => {
  return (
    <div className="politics-container">
      <h1 className="politics-title">Política de Tratamiento de Datos de Talaria</h1>
      <p className="politics-text">
        Talaria es una aplicación que ofrece asistencia en la gestión de pedidos a domicilio, comprometiéndose a proteger la privacidad de los datos de sus usuarios. Esta política de tratamiento de datos detalla cómo recopilamos, usamos, protegemos y compartimos los datos personales que obtenemos a través de la aplicación, incluyendo la información relacionada con las transacciones de pago a través de Mercado Pago.
      </p>

      <h2 className="politics-title" id="seguridad">Seguridad de la Información y Ubicación</h2>
      <p className="politics-text">
        En Talaria, la seguridad de la información y la ubicación de nuestros usuarios es una prioridad. Estos datos son esenciales para proporcionar un servicio efectivo y de calidad. Por ello, implementamos las mejores prácticas y medidas de protección para garantizar su confidencialidad, integridad y disponibilidad.
      </p>
      <p className="politics-text">
        La información de la ubicación del usuario nos permite determinar el lugar donde el cliente desea recibir su paquete. De esta manera, el encargado de la entrega puede llegar al destino con mayor facilidad. Además, gracias a nuestra herramienta de seguimiento de paquetes, el conocimiento de la ubicación de entrega permite al usuario saber cuán cerca está el paquete que está esperando.
      </p>
      <p className="politics-text">
        Para la aplicación destinada a los responsables de las entregas, también requerimos acceso a la ubicación en tiempo real. Esta medida se toma con el fin de que tanto la empresa como el cliente final puedan estar al tanto del progreso de la entrega del paquete. Esta ubicación estará visible para la empresa mientras el servicio de entrega esté activo en la aplicación. Para el usuario final, la ubicación será visible solo una vez que el paquete esté en camino y hasta que la orden se haya completado exitosamente.
      </p>
      <p className="politics-text">
        Por favor, tenga en cuenta que valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger su información. Utilizamos la ubicación únicamente para fines de prestación de servicios y seguimiento de paquetes. No compartimos ni vendemos estos datos a terceros sin su consentimiento expreso. Para obtener más detalles, consulte nuestra Política de Privacidad completa.
      </p>

      <h3 className="politics-subtitle">Recopilación de Datos</h3>
      <p className="politics-text">
        Nos esforzamos por proteger su privacidad y ofrecerle una experiencia en línea segura. Durante el proceso de registro, le solicitaremos información personal, como su nombre o dirección de correo electrónico. Esta información se utilizará para mejorar su experiencia en nuestro sitio web y para enviarle información relevante sobre nuestros productos y servicios.
        <br />
        Al proporcionarnos su información personal, usted otorga su consentimiento para que la recopilemos y utilicemos de acuerdo con esta política de privacidad.
      </p>
      <h5>Consentimiento</h5>
      <p className="politics-text">
        Al marcar la casilla de verificación durante el proceso de registro, usted acepta que recopilemos y utilicemos su información personal de acuerdo con esta política de privacidad. Si no está de acuerdo con nuestras prácticas de privacidad, por favor no proporcione su información personal.
      </p>
      <h5>Información que Recopilamos</h5>
      <p className="politics-text">
        La información recopilada por Talaria incluye:
      </p>
      <ul>
        <li>Nombre y apellido</li>
        <li>Correo electrónico</li>
        <li>Número de teléfono</li>
        <li>Número de documento</li>
        <li>Dirección de residencia</li>
        <li>Fecha de nacimiento</li>
        <li>Dirección de correo electrónico</li>
        <li>Ubicación del usuario en la web</li>
        <li>Ubicación del usuario en tiempo real desde la aplicación móvil</li>
        <li>Información de transacciones y pagos a través de Mercado Pago</li>
        <li>Fotos de los sitios de entrega de pedidos</li>
      </ul>
      <p className="politics-text">
        Si no está de acuerdo con nuestras prácticas de privacidad, por favor no proporcione su información personal.
      </p>

      <h3 className="politics-subtitle">Uso de Datos</h3>
      <p className="politics-text">
        Utilizamos la información recopilada únicamente con el fin de brindar y mejorar nuestros servicios, incluyendo la asignación de pedidos a los domiciliarios, el seguimiento en tiempo real de las entregas, la notificación a los usuarios sobre el estado de los pedidos y la gestión de transacciones de pago a través de Mercado Pago. Solo utilizaremos la información para enviar comunicaciones relacionadas con la aplicación o ofertas promocionales si los usuarios han dado su consentimiento explícito para recibir este tipo de mensajes.
      </p>
      <p className="politics-text">
        Además, es importante que los usuarios sean conscientes de que si superan el límite de pedidos de su plan, se les cobrará una tarifa adicional por cada entrega extra. El costo por pedido extra varía dependiendo del plan seleccionado. Por ejemplo, si un usuario tiene un plan de 49.500 y realiza más de 300 pedidos, se le cobrará a 165 pesos por cada entrega extra. Los detalles específicos de los costos por pedido extra para cada plan se pueden encontrar en nuestra página de precios.
      </p>
      <p className="politics-text">
        Por último, los usuarios deben saber que los pagos se realizan automáticamente cada mes. Esto significa que la tarifa del plan seleccionado se cobrará automáticamente a la tarjeta de crédito o débito del usuario cada mes.
      </p>
      <p className="politics-text">
        Es importante destacar que los titulares de los datos personales siempre pueden revocar su autorización en cualquier momento.
      </p>

      <h3 className="politics-subtitle">Almacenamiento de Datos</h3>
      <p className="politics-text">
        Los datos personales delos usuarios se almacenan en servidores de Google Cloud Platform, ubicados en los Estados Unidos. Google Cloud Platform es un servicio de alojamiento de aplicaciones web y bases de datos administrado por Google. Google Cloud Platform ofrece una plataforma de computación en la nube que incluye servicios de infraestructura como servicio (IaaS), plataforma como servicio (PaaS) y software como servicio (SaaS).
      </p>
      <p className="politics-text">
        Los datos sensibles, como los pagos recurrentes, se gestionan a través de Mercado Pago mediante una suscripción recurrente (PreApproval). Los datos de la tarjeta se capturan y almacenan en los servidores de Mercado Pago; Talaria no almacena datos de tarjeta, solo la referencia de la suscripción.
      </p>
      <p className="politics-text">
        Las fotos de los sitios de entrega de pedidos se almacenan en Firebase, una plataforma de desarrollo de aplicaciones móviles y web desarrollada por Google.
      </p>
      <a href="https://cloud.google.com/terms/data-processing-terms" target="_blank" rel="noopener noreferrer">Google Tratamiento de Datos</a>
      <a href="https://cloud.google.com/terms" target="_blank" rel="noopener noreferrer">Google Términos</a>
      <br />
      <h3 className="politics-subtitle">Compartir Datos</h3>
      <p className="politics-text">
        No compartimos la información personal de los usuarios con terceros, excepto en los casos en que sea necesario para el funcionamiento de la aplicación, como el envío de notificaciones vía WhatsApp y la gestión de transacciones de pago a través de Mercado Pago. En estos casos, los datos personales se comparten con los proveedores de servicios de mensajería instantánea, como WhatsApp, y con Mercado Pago, para que puedan enviar mensajes a los usuarios y procesar transacciones de pago, respectivamente.
      </p>

      <h3 className="politics-subtitle">Protección de Datos</h3>
      <p className="politics-text">
        Tomamos medidas técnicas y administrativas adecuadas para garantizar la seguridad de los datos personales de nuestros usuarios y prevenir su acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, es importante tener en cuenta que no existe un método de transmisión o almacenamiento de información completamente seguro en internet.
      </p>
      <p className="politics-text">
        Todo está cifrado con SSL en el transporte de datos y en reposo, toda la información es desacoplada y no se guarda ningún dato sensible sin ser encriptado.
      </p>
      <p className="politics-text">
        Además, nos aseguramos de cumplir con lo establecido por la Ley 1581 de 2012 y demás normatividad aplicable en Colombia en materia de protección de datos personales. Esto incluye, pero no se limita a, la implementación de medidas de seguridad para el almacenamiento y tratamiento de información, así como la designación de un encargado de protección de datos.
      </p>
      <p className="politics-text">
        En el caso de una brecha de seguridad, nos comprometemos a notificar a los titulares de los datos afectados de manera oportuna y a tomar las medidas necesarias para proteger sus derechos.
      </p>

      <h3 className="politics-subtitle">Cookies</h3>
      <p className="politics-text">
        Utilizamos cookies para recopilar información sobre el uso de la aplicación y mejorar su experiencia. Las cookies son pequeños archivos de texto que se almacenan en el navegador de su dispositivo cuando visita nuestro sitio web. Las cookies nos permiten reconocer su dispositivo y proporcionarle una experiencia personalizada en nuestro sitio web.
      </p>

      <h3 className="politics-subtitle">Acceso y Control de Datos</h3>
      <p className="politics-text">
        Los usuarios tienen derecho a conocer, actualizar y rectificar sus datos personales en posesión de Talaria en cualquier momento. Para ejercer este derecho, los usuarios pueden acceder a su información personal a través de la aplicación o pueden contactarnos a través de nuestro soporte para solicitar la actualización o rectificación de su información.
      </p>
      <p className="politics-text">
        Además, los usuarios tienen derecho a solicitar la supresión de sus datos personales en cualquier momento, siempre y cuando no exista una obligación legal o contractual que requiera la conservación de los mismos.
      </p>
      <p className="politics-text">
        Talaria se compromete a respetar y proteger los derechos de los titulares de los datos personales y a cumplir con las disposiciones de la Ley 1581 de 2012 y demás normativas vigentes en Colombia en materia de protección de datos personales.
      </p>

      <h3 className="politics-subtitle">Cambios en la Política de Tratamiento de Datos</h3>
      <p className="politics-text">
        Podemos actualizar esta política de tratamiento de datos periódicamente para reflejar cambios en nuestras prácticas de privacidad. Al continuar utilizando la aplicación después de la publicación de cualquier cambio, los usuarios aceptan estar sujetos a la política de tratamiento de datos actual.
      </p>
      <p className="politics-text">
        Se notificará al correo electrónico proporcionado por los usuarios cuando se realice un cambio en la política de tratamiento de datos.
      </p>
      <p className="politics-text">
        Talaria se reserva el derecho de modificar esta política de tratamiento de datos en cualquier momento, por lo que es responsabilidad de los usuarios revisar regularmente esta página para conocer los cambios y asegurarse de que están de acuerdo con ellos. En caso de que haya un cambio importante en nuestra política de tratamiento de datos, se notificará a los usuarios a través de la aplicación o mediante una notificación en el sitio web de Talaria.
      </p>

      <h3 className="politics-subtitle">Contacto</h3>
      <p className='politics-text' >
        Si tiene preguntas o comentarios sobre nuestra política de tratamiento de datos, no dude en contactarnos a través de nuestro soporte.
        Correo: suport.user@meravuelta.com
      </p>
      <p className="politics-text">
        <strong>Última actualización: 8 de junio de 2023</strong>
      </p>
    </div>
  );
};
export default Politics;
