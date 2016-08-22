module.exports = function (moduleUser){
  
  var controllers = moduleUser.controllers;

    return function(router){

    router.post("/sign-up", function(req, res){
    	controllers.signUp.signUp(req, res);
	});

    router.post("/change-password", function(req, res){
    	controllers.signUp.changePassword(req, res);
    });
   
    router.post("/login", function(req, res){
    	controllers.login.post(req, res);
    });

    router.post("/get-user", function(req, res){
    	controllers.user.getUser(req, res);
    });

    router.post("/edit-user", function(req, res){
		controllers.user.editUser(req, res);
    });

 
  }
}