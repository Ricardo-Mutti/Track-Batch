module.exports = function (moduleMachine){

  var controllers = moduleMachine.controllers;

  return function(router){
    router.post("/register-machine", function(req, res){
    	controllers.registerMachine(req, res);
    });

    router.get("/get-machine-list", function(req, res){
    	controllers.getMachineList(req, res);
    });

  }
}
