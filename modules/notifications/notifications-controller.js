module.exports = function (schema){

  var Notification = schema.notifications;
  var Notification_list = schema.notifications_list;

  return {
    addNotification: function(body, callback){
      if (body.user_id != null && body.type != null && body.id != null){
        var notif = new Notification(body);
        notif.save(function(err){
          if (err) throw err;
          var query = {};
          query.user_id = body.id;
          Notification_list.findOne(query, function(err,dbNot_list){
            if (err) throw err;
            if(dbNot_list){
              dbNot_list.notifications.unshift(notif._id);
              dbNot_list.unread_count++;
              dbNot_list.save(function(err){
                if (err) throw err;
                callback(dbNot_list.unread_count);
              })
            }else callback(false);
          })
        })
      }else callback(false);
    },
    getNotifications: function(req, res){
      if (req.query.user_id != null && req.query.user_id != "null"){
        var query = {user_id: req.query.user_id};
        Notification_list.findOne(query, function(err, lista){
          if (err) throw err;
          if (lista){
            console.log(lista.notifications.length);
            while (lista.notifications.length > 100){
              lista.notifications.pop();
            }
            var count = lista.unread_count;
            Notification.find({'_id':{ $in: lista.notifications}},null , {sort: '-_id'}, function(err,notif){
              if (err) throw err;
              lista.unread_count = 0;
              lista.save(function(err){
                if (err) throw err;
                return res.json({success: true, message: 'Notificações encontradas', response: {notifications: notif, unread: count}});
              })
            })
          }else return res.json({success: false, message: 'Notificações não encontradas'});
        })
      }else return res.json({success: false, message: 'Faltam parâmetros'});
    }
  }
}

