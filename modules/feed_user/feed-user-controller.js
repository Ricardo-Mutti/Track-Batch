module.exports = function (schema){

	var User = schema.user;
	var Post = schema.post;
	var Like = schema.likes;
	
	return{
		addPost:  function(req, res){  
		    var query ={};
		    var add = true;
	        if (req.body.post_id) {
	        	query._id = req.body.user_id;
				User.findOne(query, function(err, user){
				   	if (err) throw err;
				   	if (user != null){
				   		for (var index in user.posts){
				   			if (user.posts[index] == req.body.post_id){
				   				add = false;
				   			}
				   		}
				   		if (add){
				    		user.posts.push(req.body.post_id);
				    		user.save(function(err){
				               	if (err) throw err;
					    	   	return res.json({success: true, message: "Video salvo"});

				    		})
				    	}else res.json({success: false, message: "Já tem o video"});
				    }else return res.json({success: false, message: "Não foi possível salvar o vídeo"});
	  			});
			}else return res.json({success: false, message: "Não foram passados os parâmetros"});
		},
		removePost: function(req, res){
			var query = {};
			if (req.body.post_id && req.body.user_id){
				query._id = req.body.user_id;
				User.findOne(query, function(err,user){
					if (err) throw err;
				   	if (user != null){
			    		user.posts.splice(user.posts.indexOf(req.body.post_id),1);
			    		user.save(function(err){
			               	if (err) throw err;
				    	   	return res.json({success: true, message: "Video removido"});

			    		})
				    }else return res.json({success: false, message: "Não foi possível remover o vídeo"});
				})
			}else return res.json({success: false, message: "Não foram passados os parâmetros"});
		},
		getPost: function(req, res){
			var query = {};
			if (req.query.user_id){
				query._id = req.query.user_id;
				User.findOne(query, function(err,user){
					if (err) throw err;
				   	if (user != null){
				   		Post.find({'_id':{ $in: user.posts}}, null , function(err, docs){
				   			if (err) throw err;
				   			var final = [];
				   			for (var i = user.posts.length - 1; i >= 0; i--){
				   				for  (var index in docs){
				   					if (docs[index]._id.toString() === user.posts[i].toString()){
				   						final.push(docs[index]);
				   						break;
				   					}
				   				}
				   			}
				   			res.json({success: true, message: "Videos do usuário encontrados", response: {feed: final}});
				   		})
				    }else return res.json({success: false, message: "Não foi possível encontrar o usuário"});
				})
			}else return res.json({success: false, message: "Não foram passados os parâmetros"});
		}
	}
}