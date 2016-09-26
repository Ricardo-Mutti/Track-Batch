module.exports = function (modulePO){

  var controllers = modulePO.controllers;

  return function(router){
    router.post("/register-po", function(req, res){
    	controllers.registerPO(req, res);
    });

     router.post("/approve-po", function(req, res){
    	controllers.approvePO(req, res);
    });

     router.get("/get-po-orded", function(req, res){
    	controllers.getPOOrded(req, res);
    });

    router.get("/get-po-done", function(req, res){
    controllers.getPODone(req, res);
    });

    router.get("/get-po-approved", function(req, res){
    controllers.getPOApproved(req, res);
    });

    router.post("/get-user-po", function(req, res){
    controllers.getUserPO(req, res);
    });

  }
}
