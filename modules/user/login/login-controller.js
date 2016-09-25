module.exports = function (schema, bcrypt, jwt, config){//Aqui a gnt ta passando o schema do account, a biblioteca de criptografia, token e o arquivo config que contem a apiSecret pra gerar o token

  var Account = schema.account;
  var User = schema.user;
  const saltRounds = 4;

  return {

    post: function(req, res){
      // Procura usuario no banco
      var query = {email: req.body.email};

       Account.findOne(query, function(err, account) {//Aqui o account é a resposta da query
        if (err) throw err;
        if (!account) {
          // account nao encontrado
          return res.json({success: false, message: 'Falha na autenticação. Conta não encontrada.'});
        }  else if (account) {
           // compara passwords (com criptografia)
          bcrypt.compare(req.body.password, account.password, function(err, match) {
            if(!match){
              // passwords nao batem
              return res.json({success: false, message: 'Falha na autenticação. Senha incorreta.'});
            }
            else{
              // account e password batem
              // cria token
              var token = jwt.sign(account.toObject(), config.apiSecret());
              User.findOne(query, function(err, user){
               if (err) throw err;
               if (user){
                    return res.json({
                    success : true,
                    message : 'sucesso no login.',
                    response: {token : token, user: user}
                 });
                }else return res.json({success: false, message: 'User not find!'});
              })
                
          }
        });
       }
     });
   }
  }
}