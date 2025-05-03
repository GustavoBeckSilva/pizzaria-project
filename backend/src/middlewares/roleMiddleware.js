// src/middlewares/roleMiddleware.js
function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.tipo_usuario)) {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      next();
    };
  }
  
  module.exports = roleMiddleware;
  