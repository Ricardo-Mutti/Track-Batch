module.exports = function (schema, bcrypt, jwt, config){

  var Account = schema.account;
  var User = schema.user;

  // var createAccount = function(body, res){
  //   var account = new Account();
  //   account.username = body.username;
  //   account.email = body.email;
  //   account.facebook_id = body.facebook_id;
  //   account.save(function(err,dbAcc){
  //     if (err) throw err;

  //     var findUser = {};
  //     var user = new User(body);
  //     findUser._id = user._id;
  //     User.findOneAndUpdate(findUser, user, {upsert: true, new: true}, function(err,dbUser){
  //       if (err) throw err;

  //       var token = jwt.sign(account.toObject(), config.apiSecret());
  //       return res.json({success: true, message: "Account created", response: {token : token, usuario: dbUser}});
  //     })
  //   })
  // }
  return {
    post: function (req, res) {
      var email = req.body.email;
      if (req.body.facebook_id){
        var query = {facebook_id: req.body.facebook_id, email: req.body.email};
        Account.findOne(query,function(err,account){
          if (err) throw err;
          if (account){
            var token = jwt.sign(account.toObject(), config.apiSecret());
            User.findOne(query, function(err,dbUser){
              if (err) throw err;
              if (dbUser){
                return res.json({
                  success : true,
                  message : 'sucesso no login.',
                  token : token,
                  response: {token : token, usuario: dbUser}
                });
              }else return res.json({success: false, message: 'Usuário não encontrado!'})
            })
          }else{
            var query_email = {email: req.body.email};
            Account.findOne(query_email, function(err,acc){
              if (err) throw err;
              if (acc){
                acc.facebook_id = req.query.facebook_id;
                acc.save(function(err){
                  if (err) throw err;
                  User.findOneAndUpdate(query_email,{'facebook_id': req.query.facebook_id}, {new: true}, function(err,dbUser){
                    if (err) throw err;
                    var token = jwt.sign(account.toObject(), config.apiSecret());
                    return res.json({
                      success : true,
                      message : 'sucesso no login.',
                      token : token,
                      response: {token : token, usuario: dbUser, admin: acc.admin}
                    });
                  })
                })
              }else return res.json({success: false, message: 'facebookAccount não encontrada'})
            })
          }
        })
      }else{
        // Procura usuario no banco
        var query = {username: req.body.username};

        Account.findOne(query, function(err, account) {

          if (err) throw err;

          if (!account) {
            // account nao encontrado
            return res.json({success: false, message: 'Account does not exist'});

          } 
          else if (account) {
            // compara passwords (com criptografia)
            bcrypt.compare(req.body.password, account.password, function(err, match) {
              if(!match){
                // passwords nao batem
                return res.json({success: false, message: 'Incorrect password'});
              }
              else{
                // account e password batem
                // cria token
                if (account.admin){
                  var token = jwt.sign(account.toObject(), config.apiSecretAdmin());
                  console.log("Admin");
                }else{
                  var token = jwt.sign(account.toObject(), config.apiSecret());
                }
                User.findOne(query, function(err,dbUser){
                  if (err) throw err;
                  if (dbUser){
                    return res.json({
                      success : true,
                      message : 'sucesso no login.',
                      token : token,
                      response: {token : token, usuario: dbUser, admin: account.admin}
                    });
                  }else return res.json({success: false, message: 'Usuário não encontrado!'})
                })
              }
            });
          }
        });
      }
    }
  }
}