module.exports = function (schema){

  var Likes = schema.likes;
  var Post = schema.post;
  var User = schema.user;

  return {
      //Recebe o id do post e o id do usuário -- Posta ou Deleta um like.
      post: function (req, res) {
        var query = {};
        var query_post = {};
        var query_user = {};
        var curtido = false;
        if (req.body.post_id){
          query_post._id = req.body.post_id;
          query.post_id = req.body.post_id;
          query.user_id = req.body.user_id;
          query_user._id = req.body.user_id;
          Likes.findOne(query,function(err,like) {
            if (err) throw err;
            if (like){
            Post.findOne(query_post, function(err,post){
              post.likes--;
                like.remove(function(err){
                  if (err) throw err;
                  User.findOne(query_user,function(err,dbUser){
                    if (err) throw err;
                    if (dbUser){
                      dbUser.likes.pop(post._id);
                      dbUser.save(function(err){
                        if (err)  throw err;
                        post.save(function(err){
                          if (err) throw err;
                          return res.json({success: true, message: 'Like deletado!'})
                        })
                      })
                    }else res.json({success: false, message: 'User não encontrado!'})
                  })
                })
              })
            }else{
             Post.findOne(query_post, function(err,post){
                post.likes++;
                var newLike = new Likes();
                newLike.post_id = req.body.post_id;
                newLike.user_id = req.body.user_id;
                User.findOne(query_user,function(err,dbUser){
                  if (err) throw err;
                  if (dbUser){
                    dbUser.likes.push(post._id);
                      post.save(function(err){
                        if (err) throw err;
                        newLike.save(function(err){
                          if (err) throw err;
                          dbUser.save(function(err){
                            if (err) throw err;
                            return res.json({success: true, message: 'Like postado!'})
                          })
                        })
                      })
                  }else res.json({success: false, message: 'User não encontrado!'})
                })
            })
          }         
        })
      }else res.json({success: false, message: 'Parametros não foram passados!'})
    }
  }
}

