module.exports = function (jwt, config){

  return {
    authenticate : function(req, res, next) {
      // check header or url parameters or post parameters for token
      var bearer = req.query.token || req.headers['authorization'] || req.body.token;

      // decode token
      if (bearer) {

        var array = bearer.split(" ");
        var token = array[1];
        // verifies secret and checks exp
        var tokenSecret = config.apiSecret();
        jwt.verify(token, tokenSecret, function(err, decoded) {      
          if (err) {
                   // erro na autenticacao comum, tenta autenticacao de admin
            var tokenSecretAdmin = config.apiSecretAdmin();
            jwt.verify(token, tokenSecretAdmin, function(err, decoded) {      
              if (err) {
                // erro em ambas autenticacoes
                return res.status(403).json({ success: false, message: 'Falha na autenticação do token.' });    
              } 
              else {
                // if everything is good, save the request for use in other routes
                // autenticado como admin
                req.decoded = decoded;
                res.set({ 'content-type': 'application/json; charset=utf-8' });    
                next();
              }
            });
          } 
          else {
            // if everything is good, save the request for use in other routes
            // autenticado comum
            req.decoded = decoded;
            res.set({ 'content-type': 'application/json; charset=utf-8' });    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).json({ success: false, message: 'Nenhum token fornecido.' });
      }
    },
    authenticateAdmin : function(req, res, next) {
      // check header or url parameters or post parameters for token
      var bearer = req.body.token || req.query.token || req.headers['authorization'];

      // decode token
      if (bearer) {

        var array = bearer.split(" ");
        var token = array[1];
        // verifies secret and checks exp
        var tokenSecret = config.apiSecretAdmin();
        jwt.verify(token, tokenSecret, function(err, decoded) {      
          if (err) {
            return res.status(403).json({ success: false, message: 'Falha na autenticação do token.' });    
          } 
          else {
            // if everything is good, save the request for use in other routes
            req.decoded = decoded;
            res.set({ 'content-type': 'application/json; charset=utf-8' });    
            next();
          }
        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).json({ success: false, message: 'Nenhum token fornecido.' });    

      }
    }
  }
}