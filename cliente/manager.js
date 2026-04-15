const EXPECTED_ROLE = ['manager'];
const user = JSON.parse(sessionStorage.getItem('user') || '{}');

if (!comprobarAcceso(EXPECTED_ROLE, user)) {
  throw new Error('Acceso denegado');
}

document.getElementById('user-name').textContent = 'Usuario: ' + (user.name || 'desconocido');
document.querySelector('#btn-cierre-sesion').addEventListener('click', function () {
  sessionStorage.clear();
  window.location.href = 'index.html';
});
