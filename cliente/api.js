
// Cambiamos el endpoint a nuestro backend local para obtener datos reales
const API_ENDPOINT = 'http://localhost:3000/users';
// Carga de usuarios para el perfil admin
async function cargarUsuarios() {
  const usuariosCargadosDesdeServidor = await fetch(API_ENDPOINT, {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
  });
  if (usuariosCargadosDesdeServidor.ok) {
    const usuariosJson = await usuariosCargadosDesdeServidor.json();
    console.log('Usuarios cargados desde el servidor (JSON):', usuariosJson);
    if (usuariosJson.success) {
      return usuariosJson.users; // Devolver el array de usuarios para su procesamiento posterior
    } else {
      throw new Error('Error al cargar los usuarios: ' + usuariosJson.message);
    }
  } else {
    throw new Error(`HTTP error: ${usuariosCargadosDesdeServidor.status}`);
  }
}

async function putUsuarioActualizado(datosActualizados) {
  const response = await fetch(API_ENDPOINT + '/' + datosActualizados.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    body: JSON.stringify(datosActualizados)
  });
  if (response.ok) {
    const result = await response.json();
    if (result.success) {
    console.log('Usuario actualizado desde el servidor (JSON):', result);
      return result.usuario; // Devolver el usuario actualizado para su procesamiento posterior
    } else {
      throw new Error('Error en la actualización del usuario: ' + result.message);
    }
  } else {
    throw new Error(`HTTP error: ${response.status}`);
  }
}
