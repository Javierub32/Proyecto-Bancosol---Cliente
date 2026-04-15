/**
 * routes/auth.js
 *
 * Authentication routes.
 *
 * POST /auth/login
 *   Body:    { username: string, password: string }
 *   Success: 200  { success: true,  token: "<JWT>", user: { id, name, role } }
 *   Failure: 401  { success: false, message: "Invalid username or password." }
 *   Invalid: 400  { success: false, message: "..." }
 */

// const express = require('express');
// const bcrypt  = require('bcrypt');
// const jwt     = require('jsonwebtoken');
// const { buscarPorNombreUsuario } = require('./usersDB');
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { buscarPorNombreUsuario } from './usersDB.js';

const router = express.Router();

// ── GET /auth/login ─────────────────────────────────────────
router.get('/login', async (req, res) => {
  const { nombreUsuario, contrasena } = req.query;
// ── Se puede hacer con POST /auth/login ─────────────────────────────────────────
// router.post('/login', async (req, res) => {
//   const { nombreUsuario, contrasena } = req.body;

  // ── 1. Input validation ─────────────────────────────────────
  if (!nombreUsuario || typeof nombreUsuario !== 'string' || nombreUsuario.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'El nombre de usuario es obligatorio.',
    });
  }

  if (!contrasena || typeof contrasena !== 'string' || contrasena === '') {
    return res.status(400).json({
      success: false,
      message: 'La contraseña es obligatoria.',
    });
  }

  // ── 2. Look up user ─────────────────────────────────────────
  const user = buscarPorNombreUsuario(nombreUsuario.trim());

  // Ejecutar siempre la comparación con bcrypt incluso 
  // cuando el usuario no se encuentra para prevenir ataques de 
  // timing que podrían revelar qué nombres de usuario existen.
  const dummyHash = '$2b$10$abcdefghijklmnopqrstuvwxyz0123456789ABCDE';
  const hashToCompare = user ? user.passwordHash : dummyHash;
  const passwordMatch = await bcrypt.compare(contrasena.trim(), hashToCompare);

  if (!user || !passwordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Nombre de usuario o contraseña incorrectos.',
    });
  }

  // ── 3. Issue JWT ─────────────────────────────────────────────
  const payload = {
    sub:  user.id,       // subject — standard JWT claim
    nombre: user.nombre,
    puesto: user.puesto,
    nombreUsuario: user.nombreUsuario,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  // ── 4. Respond ───────────────────────────────────────────────
  return res.status(200).json({
    success: true,
    token,
    user: {
      id:       user.id,
      nombre:     user.nombre,
      puesto:     user.puesto,
      nombreUsuario: user.nombreUsuario,
    },
  });
});

// module.exports = router;
export default router;
