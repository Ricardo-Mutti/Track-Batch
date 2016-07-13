module.exports = function (moduleS3Config){
  
	var controllers = moduleS3Config.controllers;

	return function(router){
		router.get("/s3Write", function(req, res){
		    controllers.s3Config.s3Write(req, res);
	    });
	    router.get("/s3Read/key=:key", function(req, res){
		    controllers.s3Config.s3Read(req, res);
	    });
	}
}