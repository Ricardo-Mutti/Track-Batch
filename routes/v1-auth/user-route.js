module.exports = function (moduleUser){

  var controllers = moduleUser.controllers;

  return function(router){
    router.post("/edit-user", function(req, res){
    	controllers.user.editUser(req, res);
    });
    router.get("/get-user", function(req,res){
    	controllers.user.getUser(req, res);
    })
    router.post("/follow-user", function(req, res){
    	controllers.user.follow(req, res);
    });
    router.post("/unfollow-user", function(req, res){
    	controllers.user.unFollow(req, res);
    });
    router.post("/edit-categories", function(req, res){
    	controllers.user.editUserCategories(req, res);
    });
    router.post("/get-facebook-users", function(req, res){
        controllers.user.getUsersFacebook(req, res);
    });
    router.get("/get-follow", function(req, res){
        controllers.user.getFollow(req, res);
    });
  }

}