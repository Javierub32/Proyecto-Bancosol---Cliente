/**
 * usersDB.js
 *
 * Almacenamiento de usuarios en memoria.
 *
 * Las contraseñas son almacenadas como hashes de bcrypt.
 * Para generar un hash para una nueva contraseña, ejecute:
 *
 *   node -e "const b = require('bcrypt'); b.hash('yourpassword', 10).then(console.log)"
 *
 * Las contraseñas en texto plano para los usuarios iniciales son:
 *   admin123  →  id:1
 *   manager1  →  id:2
 *   worker1   →  id:3
 *   worker2   →  id:4
 *
 * En una aplicación real, estos datos viven en una base de datos (PostgreSQL, MySQL, etc.)
 * y este módulo sería reemplazado por consultas a la base de datos.
 */

const users = [
  {
    id: 1,
    nombreUsuario: 'admin',
    // plain: admin123
    passwordHash: '$2b$10$AebXok7XZCdrbGq/p6WT2uG/zB92lSFcW7HrUNcWvnTotchwQICO6',
    nombre: 'Hugo Moreno',
    email: 'hugo.moreno@miempresa.es',
    puesto: 'admin',
  },
  {
    id: 2,
    nombreUsuario: 'manager',
    // plain: manager1
    passwordHash: '$2b$10$00hc1u0Jp/KR8je75LPVj.MgNQUxtNzyg92LCGAphWPJIAUVTXwg6',
    nombre: 'Diana Ruiz',
    email: 'diana.ruiz@miempresa.es',
    puesto: 'manager',
  },
  {
    id: 3,
    nombreUsuario: 'ana',
    // plain: worker1
    passwordHash: '$2b$10$F1DmJgedzsm1BxLBnkVTp.jYIhvtg7RoOroQ8WJtlj4JEmg7j9xJu',
    nombre: 'Ana García',
    email: 'ana.garcia@miempresa.es',
    puesto: 'worker',
  },
  {
    id: 4,
    nombreUsuario: 'carlos',
    // plain: worker2
    passwordHash: '$2b$10$TqD6pgkAscioVNf8HUqdEOP/FU8WeChJh5.fU3rvghz.kevvbWbXC',
    nombre: 'Carlos López',
    email: 'carlos.lopez@miempresa.es',
    puesto: 'worker',
  },
];

/**
 * Find a user by username (case-insensitive).
 * Returns the user object or undefined.
 */
function buscarPorNombreUsuario(nombreUsuario) {
  return users.find(
    (u) => u.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase()
  );
}

/**
 * Find a user by user ID.
 * Returns the user object or undefined.
 */
function buscarPorIdUsuario(idUsuario) {
  return users.find((u) => u.id === parseInt(idUsuario));
}

function buscarTodosUsuarios() {
  return users;
}

// module.exports = { buscarPorNombreUsuario, buscarPorIdUsuario, buscarTodosUsuarios };
export { buscarPorNombreUsuario, buscarPorIdUsuario, buscarTodosUsuarios };
