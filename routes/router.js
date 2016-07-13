module.exports = function(express, routes, autenticacao){

	var controllerAuth = autenticacao.controllers;

    return function (app){

        var route_v1 = express.Router();

        //Rotas v1_no_auth
        for(key in routes.v1_no_auth){
            routes.v1_no_auth[key](route_v1);
        }

        // aplica autenticacao comum
        route_v1.use(function (req, res, next) {
        	controllerAuth.autenticacao.authenticate(req, res, next);
    	});

        //Rotas v1_auth
        for(key in routes.v1_auth){
            routes.v1_auth[key](route_v1);

        }

        // aplica autenticacao admin
        route_v1.use(function (req, res, next) {
        	controllerAuth.autenticacao.authenticateAdmin(req, res, next);
    	});

    	//Rotas v1_auth_admin
        for(key in routes.v1_auth_admin){
            routes.v1_auth_admin[key](route_v1);

        }

        app.use('/api', route_v1);

        var route_front = express.Router();
        //Rotas FrontEnd
        for(key in routes.frontEnd){
            routes.frontEnd[key](route_front);
        }
        app.use('', route_front);

        return app;

    }
}