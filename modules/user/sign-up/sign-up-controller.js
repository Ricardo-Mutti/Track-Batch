module.exports = function (schema, bcrypt, jwt, config){

  var Account = schema.account;
  var User = schema.user;
  const saltRounds = 4;

  var createAccount = function(bodyacc, bodyuser, res){
   var account = new Account(bodyacc);
      // encrypta senha
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(account.password, salt, function(err, hash) {
          account.password = hash;
          account.save(function (err) {
            if (err) return handleError(err);
        var user = new User(bodyuser);
        user.save(function(err){
        if (err) throw err;
          var token = jwt.sign(account.toObject(), config.apiSecret());
          return res.json({success: true, message: 'Account created', response: {token : token, usuario: user}});
            })
          })
        });
      });
    }



  return {

    signUp: function(req, res){

       Account.findOne({ $or: [{userName: req.body.userName}, {email: req.body.email}]}, function(err,acc){
        if(acc){
            if (acc.userName == req.body.userName && acc.email == req.body.email){
                return res.json({success: false, message: "This username and email already exists"});
              }else if (acc.userName == req.body.userName){
                return res.json({success: false, message: "This username already exists"});
              }else{
                return res.json({success: false, message: "This email already exists"});
              }
        }else{
             var bodyacc = {email: req.body.email, userName: req.body.userName, password: req.body.password};
             var bodyuser = {userName: req.body.userName, email: req.body.email, phoneNumber: req.body.phoneNumber};
             createAccount(bodyacc, bodyuser, res);
         }
       });
    },

    changePassword: function(req, res){
      var query = {};
      // console.log("ta aqui");
      if (req.body.email){
        query.email = req.body.email;
        Account.findOne(query, function(err,acc){
          if (err) throw err;
          if(acc){
              bcrypt.compare(req.body.password, acc.password, function(err,match){
                if (err) throw err;
                if (!match){
                  return res.json({success: false, message: "Current password does not match"});
                }else{
                  bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash){
                    acc.password = hash;
                    acc.save(function(err){
                      if (err) throw err;
                      return res.json({success: true, message: "Password changed"});
                    })
                  })
                }
              })
          }else return res.json({success: false, message: "Account not found"});
        })
      }else return res.json({success: false, message: "Missing parameters"});
    },

    resetPassword: function(req, res){

    }
  }

}