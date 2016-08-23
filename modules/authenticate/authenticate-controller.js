module.exports = function (jwt, config){

  return {
    doAuthentication : function(req, res, next) {
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
             // erro na authenticate comum, tenta authenticate de admin
            return res.status(403).json({ success: false, message: 'Falha na autenticação do token.' });    
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
    }
  }
}