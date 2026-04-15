/**
 * middleware/authenticate.js
 *
 * Express middleware that validates the JWT on every protected route.
 *
 * Usage:
 *   const authenticate = require('./middleware/authenticate');
 *   router.get('/protected', authenticate, (req, res) => { ... });
 *
 * On success it adds req.user = { sub, name, role, username, iat, exp }
 * and calls next().
 *
 * On failure it returns 401 without calling next().
 */

// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

function authenticate(req, res, next) {
  // Token must arrive as:  Authorization: Bearer <token>
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please sign in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // available in every subsequent handler
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please sign in again.'
        : 'Invalid token. Please sign in.';

    return res.status(401).json({ success: false, message });
  }
}

/**
 * Role guard factory.
 * Use after authenticate to restrict access to specific roles.
 *
 * Example — manager and admin only:
 *   router.get('/schedule', authenticate, requireRole('manager','admin'), handler);
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.puesto)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      });
    }
    next();
  };
}

// module.exports = { authenticate, requireRole };
export { authenticate, requireRole };
