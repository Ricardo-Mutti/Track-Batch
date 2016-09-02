module.exports = function (modulePO){

  var controllers = modulePO.controllers;

  return function(router){
    router.post("/register-po", function(req, res){
    	controllers.registerPO(req, res);
    });

     router.post("/approve-po", function(req, res){
    	controllers.approvePO(req, res);
    });

     router.get("/get-po", function(req, res){
    	controllers.getPO(req, res);
    });

  }
}