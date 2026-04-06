module.exports.policies = {

  // Usuário
  'usuario/create': true,
  'usuario/login': true,
  'usuario/logout': ['isAuthenticated'],
  'usuario/readall': ['isAuthenticated'],
  'usuario/readoneid': ['isAuthenticated'],
  'usuario/update': ['isAuthenticated'],
  'usuario/delete': ['isAuthenticated'],

  // Empresa
  'empresa/create': true,
  'empresa/login': true,
  'empresa/readoneid': ['isAuthenticated', 'isEmpresa'],
  'empresa/update': ['isAuthenticated', 'isEmpresa'],

  // Gato
  'gato/readall': ['isAuthenticated'],
  'gato/readoneid': ['isAuthenticated'],
  'gato/create': ['isAuthenticated', 'isEmpresa'],
  'gato/update': ['isAuthenticated', 'isEmpresa'],
  'gato/delete': ['isAuthenticated', 'isEmpresa'],

  // Foto do gato
  'fotogato/create': ['isAuthenticated', 'isEmpresa'],
  'fotogato/update': ['isAuthenticated', 'isEmpresa'],
  'fotogato/delete': ['isAuthenticated', 'isEmpresa'],
  'fotogato/readall': ['isAuthenticated'],

  // Personalidade
  'personalidade/create': ['isAuthenticated', 'isEmpresa'],
  'personalidade/update': ['isAuthenticated', 'isEmpresa'],
  'personalidade/delete': ['isAuthenticated', 'isEmpresa'],
  'personalidade/readall': ['isAuthenticated'],

  // Deficiência
  'deficiencia/create': ['isAuthenticated', 'isEmpresa'],
  'deficiencia/update': ['isAuthenticated', 'isEmpresa'],
  'deficiencia/delete': ['isAuthenticated', 'isEmpresa'],
  'deficiencia/readall': ['isAuthenticated'],
  'deficiencia/readoneid': ['isAuthenticated'],

  // GatoPersonalidade
  'gatopersonalidade/create': ['isAuthenticated', 'isEmpresa'],
  'gatopersonalidade/delete': ['isAuthenticated', 'isEmpresa'],
  'gatopersonalidade/readall': ['isAuthenticated'],

  // GatoDeficiencia
  'gatodeficiencia/create': ['isAuthenticated', 'isEmpresa'],
  'gatodeficiencia/delete': ['isAuthenticated', 'isEmpresa'],
  'gatodeficiencia/readall': ['isAuthenticated'],

  // Perfil adotante
  'perfiladotante/create': ['isAuthenticated'],
  'perfiladotante/readoneid': ['isAuthenticated'],
  'perfiladotante/update': ['isAuthenticated'],

  // Like
  'likeusuario/create': ['isAuthenticated'],
  'likeusuario/delete': ['isAuthenticated'],
  'likeusuario/readall': ['isAuthenticated'],

  // Match
  'match/create': ['isAuthenticated', 'isEmpresa'],
  'match/readall': ['isAuthenticated'],
  'match/readoneid': ['isAuthenticated'],

  // Notificação
  'notificacao/readall': ['isAuthenticated'],
  'notificacao/update': ['isAuthenticated'],

};
