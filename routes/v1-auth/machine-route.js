module.exports = function (moduleMachine){

  var controllers = moduleMachine.controllers;

  return function(router){
    router.post("/register-machine", function(req, res){
    	controllers.registerMachine(req, res);
    });

     router.post("/get-machine", function(req, res){
    	controllers.getMachine(req, res);
    });
  }
}
