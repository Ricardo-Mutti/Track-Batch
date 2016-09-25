module.exports = function (moduleUser){
  
  var controllers = moduleUser.controllers;

    return function(router){

    router.post("/sign-up", function(req, res){
        controllers.signUp.signUp(req, res);
    });

    router.post("/login", function(req, res){
        controllers.login.post(req, res);
    });
 
  }
}