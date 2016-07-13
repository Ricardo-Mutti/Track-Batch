module.exports = function (schema, mongoose){

  var Post = schema.post;
  var Like = schema.likes;
  var Comments = schema.comentario;

  return {
    getFeed: function(req, res){
      var findUser = {user_id : req.body.user_id};
      var categorias = [];

      if(req.body.categories) categorias = req.body.categories;

      var query = {};
      if (categorias.length > 0) {
        query = {categories:{$in:categorias}};
      }

      Post.find(query, null , {sort: '-postDate'}, function (err, dbPost){
        if (err) throw err;

        if (dbPost){
          if(dbPost.length == 0)
            return res.json({success: false, message: "Feed vazio"});
          else{
            return res.json({success: true, message: "Feed de vídeo", response: {feed: dbPost}});
          }
        }
      })
    },
    postVideo: function(req, res){

      var postId = {};
      if (req.body._id) {
        postId._id = req.body._id;
          var postAttributes = {};
        postAttributes.videoUrl = req.body.videoUrl;
        postAttributes.source = req.body.source;
        postAttributes.thumbUrl = req.body.thumbUrl;
        postAttributes.nome = req.body.nome;
        postAttributes.descricao = req.body.descricao;
        postAttributes.categories = req.body.categories;
        postAttributes.postDate = req.body.postDate;
      }else{
        var postAttributes = new Post(req.body);
        postId._id = postAttributes._id;
        postAttributes.commentsCount = 0;
        postAttributes.likes = 0;
        postAttributes.postDate = req.body.postDate;
      }
      Post.findOneAndUpdate(postId, postAttributes, {upsert: true, new: true}, function(err, data){
        
        if (err) throw err;
        return res.json({success: true, message: "Post criado", response: {post: data}});
      });
    },
    deletePost: function(req, res){
      var query = {};
      if (req.query.post_id){
        query._id = req.query.post_id;
        Post.findOneAndRemove(query,function(err,post){
          if (err) throw err;
          if (post){
            return res.json({success: true, message: "Post deletado", response: {video: post}});
          }else return res.json({success: false, message: "Não foi possível deletar o post"});
        })
      }
    },
    getComments: function(req, res){

      if (!req.query.post_id){
        res.json({success: false, message: "Não foi passado o id do video!"});
      }else{
        var query = {post_id: req.query.post_id};

        Comments.find(query, function(err,dbComments){
          if (err) throw err;

          if (dbComments){
            return res.json({success: true, message: "Comentarios encontrados", response: {comments: dbComments}});
          }else return res.json({success: false, message: "Não foi possível encontrar nenhum comentario!"});
        })
      }
    },
    addView: function(req, res){
      var query = {};
      if (req.body.video_id){
        query._id = req.body.video_id;
        Post.findOne(query, function(err, post){
          if (err) throw err;
          if (post){
            post.views++;
            post.save(function(err){
              if (err) throw err;
              return res.json({success: true, message: "View somada", response: {video: post}});
            })
          }else return res.json({success: false, message: "Video não encontrado"});
        })
      }else return res.json({success: false, message: "Faltam parâmetros"});
    },
    getVideo: function(req, res){
      if (req.query.video_id){
        var query = {_id: req.query.video_id};
        Post.findOne(query, function(err, video){
          if (err) throw err;
          if(video){
            return res.json({success: true, message: "Video encontrado", response: {feed: [video]}});
          }else return res.json({success: false, message: "Video não encontrado"});
         })
      }else if(req.query.search){
        Post.find({"nome": { "$regex": req.query.search, "$options": "i" }},null , {sort: '-postDate'},function(err, video){
            if (err) throw err;
            if (video){
              return res.json({success: true, message: 'Vídeo encontrado!', response: {feed: video}});
            }else return res.json({success: false, message: 'Vídeos não encontrados!'});
        })
      }else{
        Post.find({}, null , {sort: '-postDate'}, function(err, video){
            if (err) throw err;
            if (video) {
              return res.json({success: true, message: 'Vídeos encontrados!', response: {feed: video}});
            }else return res.json({success: false, message: 'Vídeos não encontrados!'});
        })
      }
    }
  }
}
