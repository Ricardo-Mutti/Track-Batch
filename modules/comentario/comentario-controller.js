module.exports = function(schema, mongoose, config, request) {

    var Comentario = schema.comentario;
    var Post = schema.post;
    var Notification = schema.notifications;
    var Notification_list = schema.notifications_list;
    var User = schema.user;

    var sendPush = function(users, username, callback){
        var count = 0;

        function findUnread(user){

            if (count >= users.length){
                callback(); // All done!
                return;
            }else{

                Notification_list.findOne({'user_id': user._id}, function(err, not){
                    if (user.device == 'ios'){
                        console.log(not);
                      var body = {
                        "users" : user._id,
                        "ios":{
                          "badge": not.unread_count + 1,
                          "alert": username + " tagged you in a video!",
                          "sound": "default"
                        }
                      };
                    }else{
                      var body = {
                        "users" : user._id,
                        "android":{
                          "data": {"message": username + " tagged you in a video!"}
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
                    count++;
                    findUnread(users[count]);
                })
            }
        }

        findUnread(users[count]);
    }

    var insertNotifications = function(id, username, video_thumb, video_id, user_id, text){
        var query = {username: username};
        User.findOne(query, function(err, user){
            if (user){
                var notification = new Notification();
                notification.text = text;
                notification.user_id = user_id;
                notification.user_photo = user.photo;
                notification.username = username;
                notification.video_id = video_id;
                notification.video_thumb = video_thumb;
                notification.type = 2;
                notification.save(function(err){
                    if (err) throw err;
                    var query = {user_id: id};
                    Notification_list.findOne(query, function(err,dbNot){
                        if(dbNot){
                            dbNot.notifications.unshift(notification._id);
                            dbNot.unread_count++;
                            dbNot.save(function(err){
                                if (err) throw err;
                                return true;
                            })
                        }else return false;
                    })
                })
            }else return false;
        })
        return false;
    }


    return {
        insertComment: function(req, res) {

            var query = {};
            if (!req.body.post_id || !req.body.user_id || !req.body.comment){
                return res.json({ success: false, message: "Faltam parâmetros" });
            }else{
                query._id = req.body.post_id;
                Post.findOne(query, function(err, post) {
                    if (err) throw err;
                    if (post) {
                        var comment = new Comentario();
                        comment.user_id = req.body.user_id;
                        comment.comment = req.body.comment;
                        comment.date = new Date();
                        comment.username = req.body.username;
                        comment.post_id = req.body.post_id;
                        comment.save(function(err) {
                            if (err){
                                return res.json({ success: false, message: "Erro ",commentCount : post.commentsCount, response: err });
                            }else{
                                post.commentsCount++;
                                var espacos = comment.comment.split(' ');
                                var usuarios = [];
                                for (var index in espacos){
                                    if (espacos[index][0] == '@'){
                                        usuarios.push(espacos[index].split('@')[1]);
                                    }
                                }
                                User.find({'username':{ $in: usuarios}}, function(err, dbUsers){
                                    if (err) throw err;
                                    if (dbUsers){
                                        for (var index in dbUsers){
                                            insertNotifications(dbUsers[index]._id,req.body.username,
                                                post.thumbUrl, post._id,req.body.user_id, req.body.comment);
                                            
                                        }
                                        sendPush(dbUsers, req.body.username, function(a){
                                            post.commentUsers.push(req.body.user_id);
                                            post.save(function(err) {
                                                if (err) return res.json({ success: false, message: "Erro ",commentCount : post.commentsCount, response: err });
                                                return res.json({ success: true, message: "Comentario criado", response: post });
                                            })
                                        })
                                    }else return res.json({ success: false, message: "User não encontrado", response: post });
                                })
                            }
                        })
                    }else return res.json({ success: false, message: "Post não encontrado", response: post });
                });
            }
        }
    }
}