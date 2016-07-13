module.exports = function (modulePassword){

  var controllers = modulePassword.controllers;

  return function(router){
    router.post("/change-password", function(req, res){
    	controllers.password.changePassword(req, res);
    });
  }

}
