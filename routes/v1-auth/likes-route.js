module.exports = function (moduleLikes){
  
  var controllers = moduleLikes.controllers;

  return function(router){
    router.post("/postLikes", function(req, res){
    	controllers.likes.post(req, res);
    });
  }
}