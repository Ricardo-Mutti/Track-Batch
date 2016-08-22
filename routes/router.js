module.exports = function(express, routes){

    return function (app){
        //Route v1
        var route_v1 = express.Router();
        
        for(key in routes.v1){
            routes.v1[key](route_v1);
        }
        return app.use('/v1', route_v1);
    }
}