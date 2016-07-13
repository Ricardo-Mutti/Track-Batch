module.exports = function (moduleCategories){

  var controllers = moduleCategories.controllers;

  return function(router){
    router.delete("/remove-categorie", function(req, res){
    	controllers.categorie.removeCategorie(req, res);
    });
    router.get("/get-categories", function(req, res){
      controllers.categorie.getCategories(req, res);
    });
  }
}
