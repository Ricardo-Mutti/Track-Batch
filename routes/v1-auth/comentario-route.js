module.exports = function (moduleComentarios){

  var controllers = moduleComentarios.controllers;

  return function(router){
    router.post("/comentario", function(req, res){
    	controllers.comentario.insertComment(req, res);
    });
  }

}
