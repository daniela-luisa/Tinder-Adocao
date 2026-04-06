module.exports = async function isEmpresa(req, res, proceed) {
  if (!req.me) {
    return res.status(401).json({ erro: 'Não autorizado.' });
  }

  if (req.me.tipo !== 'empresa') {
    return res.status(403).json({ erro: 'Acesso restrito à empresa.' });
  }

  return proceed();
};
