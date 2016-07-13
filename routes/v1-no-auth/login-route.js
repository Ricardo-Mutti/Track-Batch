module.exports = function (moduleLogin){
  
  var controllers = moduleLogin.controllers;

  return function(router){
    router.post("/login", function(req, res){
    	controllers.login.post(req, res);
    });
  }
}