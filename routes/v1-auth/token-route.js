module.exports = function (moduleToken){
  
  var controllers = moduleToken.controllers;

  return function(router){
    router.post("/edit-token", function(req, res){
    	controllers.token.editToken(req, res);
    });
  }
}