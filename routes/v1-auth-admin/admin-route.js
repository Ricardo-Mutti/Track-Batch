module.exports = function (moduleFeed, moduleCategories){

  var controllersFeed = moduleFeed.controllers;
  var controllersCat = moduleCategories.controllers;

  return function(router){
    router.post("/postVideo", function(req, res){
    	controllersFeed.videoFeed.postVideo(req, res);
    });
    router.delete("/deletePost", function(req, res){
    	controllersFeed.videoFeed.deletePost(req, res);
    });
    router.post("/add-categorie", function(req, res){
    	controllersCat.categorie.addCategorie(req, res);
    });
  }
}