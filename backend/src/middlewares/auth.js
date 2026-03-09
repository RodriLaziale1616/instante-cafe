const { verifyToken } = require('../lib/jwt');

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  try {
    const token = authHeader.replace('Bearer ', '');
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
