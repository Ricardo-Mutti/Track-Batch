module.exports = function (moduleSignIn){
  
  var controllers = moduleSignIn.controllers;

  return function(router){
    router.post("/sign-in", function(req, res){
    	controllers.signUp.post(req, res);
    });
  }
}