/**
 * users.js
 *
 * WorkForce Schedule Manager — API Server
 *
 * Start:       node server.js
 * Development: npx nodemon users.js
 */

/*
    * users.js
    * Este módulo proporciona un endpoint API para recuperar información de 
    * usuarios.
    * En una aplicación real, esto interesaría con una base de datos.
    * Para este ejemplo, usamos un almacén de usuarios en memoria 
    * definido en usersDB.js.
*/

// const express = require('express');
// const { authenticate, requireRole } = require('./authenticate');
// const { buscarPorNombreUsuario, buscarPorIdUsuario, buscarTodosUsuarios } = require('./usersDB');
import express from 'express';
import { authenticate, requireRole } from './authenticate.js';
import { buscarPorNombreUsuario, buscarPorIdUsuario, buscarTodosUsuarios } from './usersDB.js';

const router = express.Router();

// ── GET / (se monta como /users) ────────────────────────────────
// Devuelve una lista de todos los usuarios (id, nombreUsuario, nombre, puesto).
// Solo los administradores pueden ver la lista completa de usuarios.
router.get('/', authenticate, requireRole('admin'), (req, res) => {
  const users = buscarTodosUsuarios().map((user) => ({
    id: user.id,
    nombreUsuario: user.nombreUsuario,
    nombre: user.nombre,
    puesto: user.puesto,
    email: user.email
  }));

  console.log('Usuarios encontrados en el backend:', users);

  res.json({
    success: true,
    users
  });
});

// ── GET /:username ────────────────────────────────────────────
// Devuelve información del usuario (id, nombreUsuario, nombre, puesto) 
// para el nombreUsuario dado.
// Cualquier usuario autenticado puede ver la información del usuario.
router.get('/:username', authenticate, (req, res) => {
  const { username } = req.params;

  // Buscar usuario por nombreUsuario (sin distinguir mayúsculas y minúsculas)
  const user = buscarPorNombreUsuario(username);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado.',
    });
  }

  // Devolver información del usuario (excluyendo passwordHash)
  res.json({
    success: true,
    user: {
      id: user.id,
      nombreUsuario: user.nombreUsuario,
      nombre: user.nombre,
      puesto: user.puesto,
    },
  });
});

// ── PUT /:userid ───────────────────────────────────────────────
// Actualiza la información del usuario (nombreUsuario, nombre, puesto) 
// para el userid dado.
// Solo los administradores pueden actualizar la información del usuario.
router.put('/:userid', authenticate, requireRole('admin'), (req, res) => {
  const { userid } = req.params;
  const { nombre, email, puesto } = req.body;

  // Look up user by ID
  const usuario = buscarPorIdUsuario(userid);

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado.',
    });
  } else {

    if (nombre !== 'Carlos López') {
      // Actualizar información del usuario 
      // (en una aplicación real, esto actualizaría la base de datos)
      if (nombre) usuario.nombre = nombre;
      if (email) usuario.email = email;
      if (puesto) usuario.puesto = puesto;
      res.json({
        success: true,
        message: 'Usuario actualizado correctamente.',
        usuario: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          nombre: usuario.nombre,
          email: usuario.email,
          puesto: usuario.puesto,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No hay campos válidos para actualizar.',
      });
    }
  }
});

// module.exports = router;
export default router;