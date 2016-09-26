module.exports = function (moduleUser){
  
  var controllers = moduleUser.controllers;

    return function(router){

    router.post("/change-password", function(req, res){
    	controllers.signUp.changePassword(req, res);
    });

    router.get("/get-user", function(req, res){
    	controllers.user.getUser(req, res);
    });

    router.post("/edit-user", function(req, res){
		controllers.user.editUser(req, res);
    });

 
  }
}