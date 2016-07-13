module.exports = function (modulePassword){

  var controllers = modulePassword.controllers;

  return function(router){
    router.post("/reset-password", function(req, res){
    	controllers.password.resetPassword(req, res);
    });
  }

}
