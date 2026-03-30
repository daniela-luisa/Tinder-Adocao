
module.exports.routes = {

  'POST /usuario/create' : { action: 'usuario/create'},
  'DELETE /usuario/delete/:id' : { action: 'usuario/delete'},
  'GET /usuario/readall': { action: 'usuario/readall'},
  'GET /usuario/readoneid/:id': { action: 'usuario/readoneid'},
  'PUT /usuario/update/:id': { action: 'usuario/update'},

  'POST /empresa/create' : { action: 'empresa/create'},
  'GET /empresa/readoneid/:id': { action: 'empresa/readoneid'},
  'PUT /empresa/update/:id': { action: 'empresa/update'},

  'POST /gato/create' : { action: 'gato/create'},
  'DELETE /gato/delete/:id' : { action: 'gato/delete'},
  'GET /gato/readall': { action: 'gato/readall'},
  'GET /gato/readoneid/:id': { action: 'gato/readoneid'},
  'PUT /gato/update/:id': { action: 'gato/update'},

  'POST /fotogato/create/:gatoId' : { action: 'fotogato/create'},
  'DELETE /fotogato/delete/:id' : { action: 'fotogato/delete'},
  'GET /fotogato/readall/:gatoId': { action: 'fotogato/readall'},
  'PUT /fotogato/update/:id': { action: 'fotogato/update'},

  'POST /likeUsuario/create' : { action: 'likeusuario/create'},
  'DELETE /likeUsuario/delete/:id' : { action: 'likeusuario/delete'},
  'GET /likeUsuario/readall/:gatoId': { action: 'likeusuario/readall'},

  'POST /personalidade/create' : { action: 'personalidade/create'},
  'DELETE /personalidade/delete/:id' : { action: 'personalidade/delete'},
  'GET /personalidade/readall': { action: 'personalidade/readall'},
  'PUT /personalidade/update/:id': { action: 'personalidade/update'},

  'POST /deficiencia/create' : { action: 'deficiencia/create'},
  'DELETE /deficiencia/delete/:id' : { action: 'deficiencia/delete'},
  'GET /deficiencia/readall': { action: 'deficiencia/readall'},
  'GET /deficiencia/readoneid/:id': { action: 'deficiencia/readoneid'},
  'PUT /deficiencia/update/:id': { action: 'deficiencia/update'},

  'POST /gatoPersonalidade/create' : { action: 'gatopersonalidade/create'},
  'DELETE /gatoPersonalidade/delete/:id' : { action: 'gatopersonalidade/delete'},
  'GET /gatoPersonalidade/readall/:gatoId': { action: 'gatopersonalidade/readall'},

  'POST /gatoDeficiencia/create' : { action: 'gatodeficiencia/create'},
  'DELETE /gatoDeficiencia/delete/:id' : { action: 'gatodeficiencia/delete'},
  'GET /gatoDeficiencia/readall/:gatoId': { action: 'gatodeficiencia/readall'},

  'POST /perfilAdotante/create/:userId' : { action: 'perfiladotante/create'},
  'GET /perfilAdotante/readoneid/:userId': { action: 'perfiladotante/readoneid'},
  'PUT /perfilAdotante/update/:userId': { action: 'perfiladotante/update'},

  'POST /match/create' : { action: 'match/create'},
  'GET /match/readall/:userId': { action: 'match/readall'},
  'GET /match/readoneid/:id': { action: 'match/readoneid'},

  'GET /notificacao/readall/:userId': { action: 'notificacao/readall'},
  'PUT /notificacao/update/:id': { action: 'notificacao/update'},
};
