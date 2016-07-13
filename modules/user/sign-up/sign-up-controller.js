module.exports = function (schema, bcrypt, jwt, config){

  var Account = schema.account;
  var User = schema.user;
  var Notification_list = schema.notifications_list;
  const saltRounds = 4;

  var createAccount = function(bodyacc, bodyuser, res){
    var account = new Account(bodyacc);
    account.save(function(err){
      if (err) throw err;
      var user = new User(bodyuser);
      user.save(function(err){
        if (err) throw err;
        var not_list = new Notification_list();
        not_list.user_id = user._id;
        not_list.notifications = [];
        not_list.unread_count = 0;
        not_list.save(function(err){
          if (err) throw  err;
          var token = jwt.sign(account.toObject(), config.apiSecret());
          return res.json({success: true, message: 'Account created', response: {token : token, usuario: user}});
        })
      })
    })
  }

  return {
    post: function(req, res){
      var query = {};
      var upper = false;
      if (req.body.username){
        // for (var index in req.body.username){
        //   if (req.body.username[index] == req.body.username[index].toUpperCase()){
        //     upper = true;
        //   }
        // }
        if (req.body.username.indexOf(' ') >= 0){
          return res.json({success: false, message: "Please insert a valid username (no empty spaces)"});
        }else if (upper == true){
          return res.json({success: false, message: "Please insert a valid username (no uppercase)"});
        }else{
          Account.findOne({ $or: [{username: req.body.username}, {email: req.body.email}]}, function(err,acc){
            if (acc){
              if (acc.username == req.body.username && acc.email == req.body.email){
                return res.json({success: false, message: "This username/email already exists"});
              }else if (acc.username == req.body.username){
                return res.json({success: false, message: "This username already exists"});
              }else{
                return res.json({success: false, message: "This email already exists"});
              }
            }else{
              if (req.body.facebook_id){
                var bodyacc = {email: req.body.email, facebook_id: req.body.facebook_id, 
                              username: req.body.username, admin: false};
                var bodyuser = {email: req.body.email, facebook_id: req.body.facebook_id, 
                                username: req.body.username, first_name: req.body.first_name,photo: req.body.photo, last_name: req.body.last_name};
                createAccount(bodyacc, bodyuser, res);
              }else{
                bcrypt.hash(req.body.password, saltRounds, function(err, hash){
                  var bodyacc = {email: req.body.email, password: hash, 
                                  username: req.body.username, admin: false};
                  var bodyuser = {email: req.body.email, username: req.body.username, 
                                  first_name: req.body.first_name, last_name: req.body.last_name};
                  createAccount(bodyacc, bodyuser, res);
                })
              }
            }
          });
        }
      }else return res.json({success: false, message: "Please, insert a username"});
    }
  }

}
