module.exports = function (modulePO){

  var controllers = modulePO.controllers;

  return function(router){
    router.post("/register-product", function(req, res){
    	controllers.registerProduct(req, res);
    });

    router.get("/get-product", function(req, res){
    	controllers.getProduct(req, res);
    });

    router.post("/edit-product", function(req, res){
    	controllers.editProduct(req, res);
    });

  }
}
