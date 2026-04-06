const jwt = require('jsonwebtoken');

module.exports = async function isAuthenticated(req, res, proceed) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ erro: 'Usuário não Logado.' });
  }

  try {
    const payload = jwt.verify(token, sails.config.custom.jwtSecret);
    req.me = payload;
    return proceed();
  } catch (unusedErr) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};
