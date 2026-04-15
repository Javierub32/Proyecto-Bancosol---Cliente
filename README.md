# Propuesta de esqueleto de cliente web para el caso práctico

En la carpeta `cliente` hay una serie de archivos HTML, CSS y JavaScript (el CSS es mínimo, solo para usar una ventana modal) en los que se propone una base mínima para la estructura de la parte de cliente que se pide en el caso práctico. En la carpeta `servidor` hay un pequeño servidor Node.js / Express que simula parte del funcionamiento esperado del servidor (ni siquiera tiene base de datos, trata los datos con una variable en un archivo JSON).

# Cliente

El cliente simula una aplicación a la que hay que acceder de manera autenticada con un nombre de usuario y una contraseña. Cada usuario tendrá uno de los tres perfiles disponibles (_admin_, _manager_, _worker_). Cada uno de los usuarios tendrá su propia página en la que se podrá acceder a las acciones que tiene permitidas.

## Comunicación con el servidor

La comunicación entre el cliente y el servidor se hace en base a métodos HTTP GET y POST, que están definidos en los archivos del servidor.

## Autenticación

La primera página del cliente es la de inicio, que consta solo de un formulario en el que se pide el nombre de usuario y la contraseña de la persona que va a iniciar sesión. Los usuarios y sus contraseñas están definidos en el archivo `usersDB.js` del servidor.

La acción asociada al botón del formulario es un envío HTTP GET con la función `fecth`, aportando los datos del formulario. Si el servidor devuelve una respuesta de éxito, incluye en la respuesta un JSON Web Token (JWT), que el cliente guardará en la memoria local (es Session Storage, concretamente) para identificarse en peticiones posteriores.

## Paso a la página inicial

Si la autenticación es correcta, se pasará a la página inicial del perfil del usuario autenticado. El cambio a la nueva página se consigue asignando a la propiedad `window.location.href` una cadena de caracteres con la URL de la nueva página.

## Página inicial del administrador

El administrador es el único usuario del que hay algo implementado. En la página inicial tiene tres enlaces, uno a la misma página (poco útil), otro a la página de personal y otro a la página de configuración (aún sin implementar).

El código inicial de la página comprueba que hay un perfil de usuario guardado en la memoria Session Storage y que este es el de administrador. En caso contrario, redirige a la página de inicio de sesión.

Hay un botón de cierre de sesión que borra el contenido de la memoria de Session Storage y redirige a la página de inicio de sesión.

## Página de personal

La página de personal tiene una parte de elementos HTML estáticos (cabecera, lista de enlaces, botón de cerrar sesión, cabecera "Zona de administración de usuarios", cabecera de la tabla ("Nombre", "Email", "Perfil") y pie de página) y una parte de elementos HTML dinámicos. Esta parte constituye el cuerpo de la tabla y contiene la información de los empleados registrados en el servidor.

La información sobre los empleados se trae con una consulta GET del servidor (función `cargarUsuarios()` del archivo `api.js`) y se añaden los elementos necesarios al DOM de la página para que aparezca una fila en la tabla por cada uno de los trabajadores.

Cada fila tiene un botón a la derecha que sirve para cambiar la información sobre cada empleado. Al pulsar sobre el botón se abre una ventana modal cuyos campos están rellenados inicialmente con los datos del empleado de la misma fila. El usuario puede modificarlos y enviar una petición de cambio al servidor (función `putUsuarioActualizado()` del archivo `api.js`). En una aplicación real, se actualizaría la tabla con los nuevos datos si el la respuesta del servidor es correcta, pero en el ejemplo no está implementada esa funcionalidad.

## Funciones de conexión con el servidor

Todas las funciones de conexión con el servidor a través de operaciones HTTP (GET, POST y PUT) se han agrupado en el archivo `api.js`. Todas tienen una estructura similar: son operaciones asíncrona (`async`), que usan una operación `fetch` para hacer la petición con el servidor y devuelven una promesa con el resultado o elevan una excepción si ha habido un error.

En la página de personal, su uso es similar en todos los casos. El resultado de la llamada a la función se asigna a una promesa dentro de una sentencia `try-catch`. La rama `catch` del `try-catch` se ejecutará si la respuesta es incorrecta (fuera del rango 200-299) o si la lectura del contenido JSON de la respuesta da algún error (campo `success` es falso). La sentencia `catch` correspondiente a la promesa se ejecutará si hay algún problema de acceso al servidor y la función `fetch()` rechaza la promesa.

## Identificación con JWT

Las funciones que acceden al servidor, a través de la operación `fetch`, ya sea para hacer un GET o un PUT, usan el JWT obtenido en el inicio de sesión y almacenado en el Session Storage para identificarse.

El JWT se incluye como parte de la cabecera, con la propiedad `Authorization`, que debe tener el valor `Bearer `, seguido del token. El código concreto es:

```
async function cargarUsuarios() {
  const usuariosCargadosDesdeServidor = await fetch(API_ENDPOINT, {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
  });

. . .
async function putUsuarioActualizado(datosActualizados) {
  const response = await fetch(API_ENDPOINT + '/' + datosActualizados.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    body: JSON.stringify(datosActualizados)
  });
. . .
```

# Simulador de API de Servidor

Este es un servidor Node.js / Express mínimo que simula algunas características de un servidor real para poder responder a peticiones de un cliente basado en HTML/CSS/JavaScrip. Maneja la autenticación con JWT y proporciona puntos de conexión a la API protegidos.

## Estructura de archivos

```
servidor/
├── servidor.js                  ← Punto de entrada - inicia Express
├── usersDB.js                 ← Almacenamiento en memoria del usuario (sustituir por base de datos)
├── users.js                   ← Operaciones de consulta y actualización de usuarios
├── routes/
│   └── auth.js                ← POST /auth/login
├── middleware/
│   └── authenticate.js        ← Validación JWT + control de perfiles
├── generate-hashes.js         ← Función auxiliar de un solo uso para hash de passwords
├── .env                       ← Variables de entorno (no incluir en commit en repositorios)
├── .gitignore
└── package.json
```

## Inicio rápido

```bash
# 1. Instalación de dependencias
npm install

# 2. Generar hashes reales de contraseñas (solo en la primera ejecución)
node generate-hashes.js
# Copiar las contraseñas generadas en usersDB.js

# 3. Editar .env — poner un JWT_SECRET fuerte

# 4. Inicializar el servidor
npm start

# Desarrollo (auto-reinicio cuando haya cambios en los archivos)
npm run dev
```

El servidor atiende en http://localhost:3000 por defecto.

## API

### POST /auth/login (public)

Cuero de la petición:

```json
{ "nombreUsuario": "admin", "contrasena": "admin123" }
```

Success `200`:

```json
{
  "success": true,
  "token": "<JWT>",
  "user": {
    "id": 1,
    "nombre": "Hugo Moreno",
    "puesto": "admin",
    "nombreUsuario": "admin"
  }
}
```

Failure `401`:

```json
{ "success": false, "message": "Invalid username or password." }
```

---

### GET /me (authenticated)

Cabecera: `Authorization: Bearer <token>`

Devuelve la carga útil del token decodificada.

---

### GET /schedule?from=YYYY-MM-DD&to=YYYY-MM-DD (manager / admin)

Cabecerra: `Authorization: Bearer <token>`

Devuelve la planificación en el rango de fechas

---

### GET /health (public)

Devuelve `{ "status": "ok", "time": "..." }`.

---

## Usuarios iniciales

| username | password | role    |
| -------- | -------- | ------- |
| admin    | admin123 | admin   |
| manager  | manager1 | manager |
| ana      | worker1  | worker  |
| carlos   | worker2  | worker  |

## Consejos de seguridad

- Cambia `JWT_SECRET` en `.env` por una cadena larga aleatoria antes de desplegar el servidor.
- Sustituye el contenido de `usersDB.js` con consultas reales a una base de datos.
- Habilita HTTPS en producciónn (termina TLS en un _proxy_ inverso como nginx).
- Añade una política de _rate-limiting_ to `/auth/login` (p.ej. `express-rate-limit`) para prevenir ataques de fuerza bruta.
- En un sistema real no incluyas nunca `.env` en los _commit_ del control de versiones cuando ya se le ha dado un valor bueno a `JWT_SECRET`.
