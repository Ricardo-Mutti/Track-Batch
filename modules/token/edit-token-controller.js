module.exports = function (schema, config, request){

	var User = schema.user;
	
	return{
		editToken: function(req, res){
			var query = {};
			if (!(req.body.device_token && req.body.device_type && req.body.user_id)){
				return res.json({success:false, message: "Parâmetros não foram passados"});
			} else{
				if (req.body.device_token != ""){
					query._id = req.body.user_id;
					var body = {
						"user": req.body.user_id,
						"type": req.body.device_type,
						"token": req.body.device_token
					};

					User.findOne(query, function(err,dbUser){
						if (err) throw err;
						if (dbUser){
							dbUser.token = req.body.device_token;
							dbUser.device = req.body.device_type;
							dbUser.save(function(err){
								if (err) throw err;
							    request({
							      url: config.pushUrl() + "/subscribe",
							      method: "POST",
							      json: true,
							      body: body},
							      function(err,response,body){
							     	console.log(response.statusCode);
							        if (!err && response.statusCode == 200)
							        console.log("subscribe " + body);

							    });

								return res.json({success:true, message: "Sucesso ao salvar o token."});
							})
						}else return res.json({success:false, message: "Usuário não encontrado."});
					})
				}else if(req.body.token == ""){
					query._id = req.body.user_id;
					var bToken = {"user": req.body.user_id};
					User.findOne(query, function(err,dbUser){
						if (err) throw err;
						if (dbUser){
							dbUser.token = req.body.device_token;
							dbUser.save(function(err){
								if (err) throw err;
							    request({
							      url: config.pushUrl() + "/unsubscribe",
							      method: "POST",
							      json: true,
							      body: bToken},
							      function(err,response,body){
							     	console.log(response.statusCode);
							        if (!err && response.statusCode == 200)
							        console.log("subscribe " + body);

							    });

								return res.json({success:true, message: "Sucesso ao salvar o token."});
							})
						}else return res.json({success:false, message: "Usuário não encontrado."});
					})
				}
			}
		}

	}
}