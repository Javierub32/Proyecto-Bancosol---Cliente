const user = JSON.parse(sessionStorage.getItem('user') || '{}');
const EXPECTED_ROLE = ['admin'];

if (!comprobarAcceso(EXPECTED_ROLE, user)) {
  throw new Error('Acceso denegado');
}

document.querySelector('#nombre-usuario').textContent = 'Usuario: ' + (user.name || 'desconocido');
document.querySelector('#btn-cierre-sesion').addEventListener('click', function () {
  sessionStorage.clear();
  window.location.href = 'index.html';
});
