module.exports = function (moduleBatch){

  var controllers = moduleBatch.controllers;

  return function(router){
    
    router.get("/get-batch", function(req, res){
    	controllers.getBatch(req, res);

    });
  }
}
