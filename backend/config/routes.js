
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
};
