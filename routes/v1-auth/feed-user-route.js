module.exports = function (moduleFeedUser){

  var controllers = moduleFeedUser.controllers;

  return function(router){
    router.post("/insertFeed", function(req, res){
    	controllers.userFeed.addPost(req, res);
    });
    router.post("/removePost", function(req, res){
    	controllers.userFeed.removePost(req, res);
    });
    router.get("/getPosts", function(req, res){
    	controllers.userFeed.getPost(req, res);
    });
  }

}
