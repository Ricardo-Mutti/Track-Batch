module.exports = function (schema, mongoose,bcrypt, crypto, config){

  var Account = schema.account;
  var transporter = config.transporter();
  const saltRounds = 4;

  var sendEmail = function (email, password, callback){
    // setup e-mail data with unicode symbols
    var mailOptions = {
        to: email, // list of receivers
        subject: 'Bowl Password',
         // Subject line
        text: 'Your password was changed.\n' +'The new password is: ' + password, // plaintext body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        callback(error);
    });
  }

  return {
    changePassword: function(req, res){
      var query = {};
      if (req.body.email){
        query.email = req.body.email;
        console.log(query);
        Account.findOne(query, function(err,acc){
          if (err) throw err;
          console.log(acc);
          if (acc){
            //verifica se a senha digitada e a senha salva no banco de dados são iguais
            if (acc.password){
              bcrypt.compare(req.body.password, acc.password, function(err,match){
                if (err) throw err;
                if (!match){
                  return res.json({success: false, message: "Current password does not match"});
                }else{
                  bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash){
                    acc.password = hash;
                    acc.save(function(err){
                      if (err) throw err;

                      return res.json({success: true, message: "Success"});
                    })
                  })
                }
              })
            }else return res.json({success: false, message: "Account não tem password"});
          }else return res.json({success: false, message: "Account não encontrada"});
        })
      }else return res.json({success: false, message: "Não foram passados os parâmetros"});
    },
    resetPassword : function(req, res){
      var query = {};
      query.email = req.body.email;
      if (req.body.email) {
        Account.findOne(query, function(err,acc){
          if (err) throw err;

          if (acc){
            if (acc.facebook_id){
             return res.json({success: false, message: "This email is associated with a facebook account. Please, sign-in with your facebook."});
            }else{
              //Cria uma nova senha
              var password = Math.floor(Math.random() * (9999999 - 100000 + 1)) + 100000;
              var md5 = crypto.createHash('md5').update(password.toString()).digest("hex");
              //encrypta a nova senha
              bcrypt.hash(md5, saltRounds, function(err,hash){
                if (err) throw err;
                acc.password = hash;
                acc.save(function(err){
                  if (err) throw err;
                  sendEmail(acc.email, password, function(err){
                    if (err) throw err;
                    return res.json({success: true, message: "Senha resetada com sucesso"});
                  })
                 })

              })
            }
          }
          else{
            return res.json({success: false, message: "This email isn't registered"});
          }
        })
      }
      else return res.json({success: false, message: "This email isn't registered"});
    }
  }
}
