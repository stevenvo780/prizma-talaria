async function enviarCorreo() {
  const name = document.getElementById('name').value;
  const mail = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;

  const data = { name, mail, phone, message };

  try {
    const respuesta = await fetch('https://apidomiciliostypescript-xb252ymbgq-uc.a.run.app/api/questionMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (respuesta.ok) {
      console.log('Correo enviado exitosamente');
    } else {
      throw new Error('Error al enviar correo');
    }
  } catch (error) {
    console.error(error);
  }
}

document.getElementById('contactForm').addEventListener('submit', enviarCorreo);
