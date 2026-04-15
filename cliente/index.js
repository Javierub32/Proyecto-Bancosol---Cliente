const API_ENDPOINT = 'http://localhost:3000/auth/login';
const PAGINAS_POR_PUESTO = {
  admin: 'admin.html',
  manager: 'manager.html',
  worker: 'worker.html'
};

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombreUsuario = document.getElementById('username').value.trim();
  const contrasena = document.getElementById('password').value;
  const message = document.getElementById('message');

  message.textContent = 'Iniciando sesión...';

  try {
    const response = await fetch(API_ENDPOINT + 
      `?nombreUsuario=${encodeURIComponent(nombreUsuario)}&contrasena=${encodeURIComponent(contrasena)}`, {
    });
    // const response = await fetch(API_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ nombreUsuario, contrasena })
    // });

    const data = await response.json();

    if (response.ok && data.token && data.user && data.user.puesto) {
      // Store auth data for use in subsequent pages.
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      const targetPage = PAGINAS_POR_PUESTO[data.user.puesto];

      if (!targetPage) {
        message.textContent = 'Error: puesto no reconocido.';
        return;
      }

      message.textContent = 'Inicio de sesión correcto. Redirigiendo...';
      window.location.href = targetPage;
    } else {
      message.textContent = 'Error: ' + (data.message || 'Credenciales inválidas.');
    }
  } catch (err) {
    message.textContent = 'Could not reach the server: ' + err.message;
  }
});
