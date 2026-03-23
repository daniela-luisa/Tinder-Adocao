
module.exports.routes = {

  'POST /usuario/create' : { action: 'usuario/create'},
  'DELETE /usuario/delete/:id' : { action: 'usuario/delete'},
  'GET /usuario/readall': { action: 'usuario/readall'},
  'GET /usuario/readoneid/:id': { action: 'usuario/readoneid'},
  'PUT /usuario/update/:id': { action: 'usuario/update'},

  'POST /empresa/create' : { action: 'empresa/create'},
  // 'DELETE /empresa/delete/:id' : { action: 'empresa/delete'},
  // 'GET /empresa/readall': { action: 'empresa/readall'},
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
  // 'GET /fotogato/readoneid/:id': { action: 'fotogato/readoneid'},
  'PUT /fotogato/update/:id': { action: 'fotogato/update'},

};
