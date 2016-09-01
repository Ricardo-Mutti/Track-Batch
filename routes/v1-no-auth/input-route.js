module.exports = function (moduleInput){
  
  var controllers = moduleInput.controllers;

    return function(router){

    router.post("/register-rfid-input", function(req, res){
        controllers.registerRFIDInput(req, res);
    }); 

     router.post("/register-operator-input", function(req, res){
        controllers.registerOperatorInput(req, res);
    }); 
  }
}