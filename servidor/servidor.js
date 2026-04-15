/**
 * servidor.js
 *
 * WorkForce Schedule Manager — API Server
 *
 * Start:       node servidor.js
 * Development: npx nodemon servidor.js
 */

// require('dotenv').config();

import "dotenv/config.js";

// const express = require('express');
// const cors    = require('cors');
// const { authenticate, requireRole } = require('./authenticate');
import express from 'express';
import cors from 'cors';
import { authenticate, requireRole } from './authenticate.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS ─────────────────────────────────────────────────────
// Allow only the origins listed in .env (CORS_ORIGIN).
// During development you can set CORS_ORIGIN=* to allow all.
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── BODY PARSING ─────────────────────────────────────────────
app.use(express.json());

// ── ROUTES ───────────────────────────────────────────────────

// Public — no token required
//app.use('/auth', require('./auth'));
app.use('/auth',(await import('./auth.js')).default);

// Protected example routes (require a valid JWT)
// These are stubs showing how to add more endpoints later.

// Any authenticated user
app.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Managers and admins only

// app.use('/users', require('./users'));
app.use('/users', (await import('./users.js')).default);

app.get('/schedule', authenticate, requireRole('manager', 'admin'), (req, res) => {
  const { from, to } = req.query;
  res.json({
    success: true,
    message: `Schedule from ${from} to ${to} — replace with real data.`,
  });
});

// All authenticated users
app.get('/works', authenticate, (req, res) => {
  res.json({ success: true, works: [] });
});

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`WorkForce API server running on http://localhost:${PORT}`);
  console.log(`  POST http://localhost:${PORT}/auth/login`);
  console.log(`  GET  http://localhost:${PORT}/health`);
});
