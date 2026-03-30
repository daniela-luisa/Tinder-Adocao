module.exports = function unauthorized(data) {
  var res = this.res;

  res.status(401).json({
    erro: (data && data.message) || 'Não autorizado.',
  });
};
