module.exports = function (moduleBatch){

  var controllers = moduleBatch.controllers;

  return function(router){
    
    router.get("/get-batch", function(req, res){
    	controllers.getBatch(req, res);
    });

     router.get("/get-finished-batch", function(req, res){
    	controllers.getFinishedBatch(req, res);
    });

    router.post("/register-batch", function(req, res){
      controllers.registerBatch(req, res);
    });

   router.post("/start-batch-production", function(req, res){
      controllers.startBatchProduction(req, res);
    });

  }
}
