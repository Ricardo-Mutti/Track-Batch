module.exports = function(express, routes, authenticate){

	var controllerAuth = authenticate.controllers;

    return function (app){

        //Route v1
        var route_v1 = express.Router();

        //Rotas v1_no_auth
        for(key in routes.v1_no_auth){
            routes.v1_no_auth[key](route_v1);
        }
        
        // aplica authenticate comum
        route_v1.use(function (req, res, next) {
        	controllerAuth.authenticate.doAuthentication(req, res, next);
    	});

    	 //Rotas v1_auth
        for(key in routes.v1_auth){
            routes.v1_auth[key](route_v1);
        }

        return app.use('/v1', route_v1);
    }
}