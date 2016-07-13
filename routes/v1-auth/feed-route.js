module.exports = function (moduleFeed){

  var controllers = moduleFeed.controllers;

  return function(router){
    router.post("/getFeed", function(req, res){
    	controllers.videoFeed.getFeed(req, res);
    });
    router.get("/getComments", function(req, res){
      controllers.videoFeed.getComments(req, res);
    });
    router.post("/addView", function(req, res){
      controllers.videoFeed.addView(req, res);
    });
    router.get("/get-video", function(req,res){
      controllers.videoFeed.getVideo(req, res);
    });
  }
}
