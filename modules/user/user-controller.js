module.exports = function (schema, mongoose, notifications, config, request){


  var Account = schema.account;
  var User = schema.user;
  var addNotification = notifications.controllers.notifications.addNotification;

  var find = function(array, compare){
    var found = false;
    for (var index in array){
      if (array[index] == compare){
        found = true;
      }
    }
    return found;
  }
  
  var sendPush = function(user_id, device, username, badge){
    if (device == 'ios'){
      var body = {
        "users" : user_id,
        "ios":{
          "badge": badge,
          "alert": username +" started following you!",
          "sound": "default"
        }
      };
    }else{
      var body = {
        "users" : user_id,
        "android":{
          "data": {"message": username +" started following you!"}
        }
      };
    }
    request({
      url: config.pushUrl() + "/send",
      method: "POST",
      json: true,
      body: body},
      function(err,response,body){
        if (!err && response.statusCode == 200)
        console.log("Sucesso ao enviar o post");
        console.log(body + " body")

    });
  }

  return {
    //Modifica: first_name, last_name e photo -> mandar tudo isso + o _id do user.
    editUser: function (req, res) {
      var query = {};
      var update = req.body;
      if (req.body.user_id){
        query._id = req.body.user_id;
        User.findOneAndUpdate(query, update, {new: true}, function(err, user){
          if (err) throw err;

          if (user){
            return res.json({success: true, message: 'Usuário atualizado!', response: {user_atualizado: user}});
          }else return res.json({success: false, message: 'Usuário não foi atualizado!'});
        })
      }else return res.json({success: false, message: 'Faltam parâmetros!'});
    },
    getUser : function(req,res){
      var query = {};
      if (req.query.user_id){
        query._id = req.query.user_id;
        User.findOne(query, function(err, dbUser){
          if (err) throw err;
          if (dbUser){
            return res.json({success: true, message: 'Usuário encontrado!', response: {user: [dbUser]}});
          }else return res.json({success: false, message: 'Usuário não foi encontrado!'});
        })
      }else if(req.query.username){
        query.username = req.query.username;
          User.findOne(query, function(err, dbUser){
          if (err) throw err;
          if (dbUser){
            return res.json({success: true, message: 'Usuário encontrado!', response: {user: [dbUser]}});
          }else return res.json({success: false, message: 'Usuário não foi encontrado!'});
        })
      }else if(req.query.search){
        console.log(req.query.search);
        var espacos = req.query.search.split(' ');
        var campos = [];
        for (var index in espacos){
          // campos.push({ "$regex": espacos[index], "$options": "i"});
          campos.push(new RegExp(espacos[index],'i'));
        }
        console.log(campos);
        User.find({$or: [{"first_name": {$in: campos}},
                         {"username": {$in: campos}},
                         {"last_name": {$in: campos}}]},function(err, dbUser){
            if (err) throw err;
            return res.json({success: true, message: 'Usuário encontrado!', response: {user: dbUser}});
        })
      }else{
        User.find(query, function(err, dbUser){
            if (err) throw err;
            if (dbUser){
              return res.json({success: true, message: 'Usuário encontrado!', response: {user: dbUser}});
            }else return res.json({success: false, message: 'Usuário não foi encontrado!'});
        })
      }
    },
    follow: function(req,res){
      var query_to_follow = {};
      var query_follower = {};
      if(req.body.to_follow_id && req.body.follower_id){
        query_to_follow._id = req.body.to_follow_id;
        query_follower._id = req.body.follower_id;
        User.findOne(query_follower, function(err,dbUser_follower){
          if (err) throw err;
          if (dbUser_follower){
            if (!find(dbUser_follower.following, req.body.to_follow_id)){
              dbUser_follower.following.push(req.body.to_follow_id);
              dbUser_follower.save(function(err){
                if (err) throw err;
                User.findOne(query_to_follow, function(err, dbUser_follow){
                  if (err) throw err;
                  if (dbUser_follow){
                    if (!find(dbUser_follow.followers, req.body.follower_id)){
                      dbUser_follow.followers.push(req.body.follower_id);
                      dbUser_follow.save(function(err){
                        if (err) throw err;
                        var body = {user_id: dbUser_follower._id, user_photo: dbUser_follower.photo, type: 1, 
                                  username: dbUser_follower.username, id: dbUser_follow._id};
                        addNotification(body,function(sucesso){
                          if (sucesso) {
                            sendPush(dbUser_follow._id, dbUser_follow.device, dbUser_follower.username, sucesso);
                            return res.json({success: true, message: 'Sucesso ao seguir'});
                          }else return res.json({success: false, message: 'Não foi possível postar a notificação'});
                        });
                      })
                    }else return res.json({success: false, message: 'Já segue o usuário'});
                  }else return res.json({success: false, message: 'Usuário follower não foi encontrado!'});
                })
              })
            
            }else return res.json({success: false, message: 'Já segue o usuário'});
          }else return res.json({success: false, message: 'Usuário follower não foi encontrado!'});
        })
      }
    },
    unFollow: function(req,res){
      var query_to_follow = {};
      var query_follower = {};
      if(req.body.to_follow_id && req.body.follower_id){
        query_to_follow._id = req.body.to_follow_id;
        query_follower._id = req.body.follower_id;
        User.findOne(query_follower, function(err,dbUser_follower){
          if (err) throw err;

          if (dbUser_follower){
            if (find(dbUser_follower.following, req.body.to_follow_id)){
              dbUser_follower.following.splice(dbUser_follower.following.indexOf(req.body.to_follow_id), 1);
              User.findOne(query_to_follow, function(err, dbUser_follow){
                if (err) throw err;
                if (dbUser_follow){
                  if (find(dbUser_follow.followers, req.body.follower_id)){
                    dbUser_follow.followers.splice(dbUser_follow.followers.indexOf(req.body.follower_id), 1);
                    dbUser_follower.save(function(err){
                      if (err) throw err;
                      dbUser_follow.save(function(err){
                        if (err) throw err;
                        return res.json({success: true, message: 'Sucesso ao parar de seguir'});
                      })
                    })
                  }else return res.json({success: false, message: 'Não segue o usuário'});
                }else return res.json({success: false, message: 'Usuário follower não foi encontrado!'});
              })
            }else return res.json({success: false, message: 'Não segue o usuário'});
          }else return res.json({success: false, message: 'Usuário follower não foi encontrado!'});
        })
      }
    },
    editUserCategories: function(req, res){
      var query = {};
      if (req.body.user_id){
        query._id = req.body.user_id;
        User.findOne(query, function(err, dbUser){
          if (err) throw err;

          if (dbUser){
            var categories = req.body.categories;
            console.dir(categories);
            for (var index in categories){
              categories[index] = mongoose.Types.ObjectId(categories[index]);
            }
            console.dir(req.body.categories);
            dbUser.categories = categories;
            dbUser.save(function(err){
              if (err) throw err;
              return res.json({success: true, message: 'Categorias foram atualizadas.'});
            })
          }else return res.json({success: false, message: 'Usuário  não foi encontrado!'});
        })
      }else return res.json({success: false, message: 'Id do usuário não foi passado!'});
    },
    getUsersFacebook: function(req, res){
      if (req.body.facebook_ids){
        User.find({'facebook_id':{ $in: req.body.facebook_ids}}, function(err, dbUsers){
          if (err) throw err;
  
          if (dbUsers){
            return res.json({success: true, message: 'Usuários encontrados', response: {user: dbUsers}});
          }else return res.json({success: false, message: 'Usuários não foram encontrados'});     
        })
      }else return res.json({success: false, message: 'Ids do facebook não foram passados!'});
    },
    getFollow: function(req, res){
      if (req.query.user_id){
        var query = {_id: req.query.user_id}
        User.findOne(query, function(err, dbUser){
          if (err) throw err;
          if (dbUser){
            User.find({_id:{$in: dbUser.followers}}, function(err, followers){
              if (err) throw err;
              if (followers){
                User.find({_id:{$in: dbUser.following}}, function(err, following){
                  if (err) throw err;
                  if (following){
                    return res.json({success: true, message: 'Seguidores encontrados', 
                                    response: {followers: followers, following: following}});
                  }else return res.json({success: false, message: 'Following não encontrados'});
                });
              }else return res.json({success: false, message: 'Followers não encontrados'});
            })
          }else return res.json({success: false, message: 'Usuário não encontrado'});
        })
      }else return res.json({success: false, message: 'ID do usuário não foi passado'});
    }
  }
}