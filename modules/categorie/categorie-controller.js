module.exports = function (schema){

	var Categorie = schema.categories;
	var User = schema.user;
	
	return{
		addCategorie: function(req, res){
			if (req.body){
				var categorie = new Categorie();
				categorie.name = req.body.name.toUpperCase();
				categorie.save(function(err){
					if (err) throw err;
					return res.json({success: true, message: "Categoria salva", reponse: {categorie: categorie}});
				})
			}else return res.json({success: false, message: "Parâmetros não foram passados"});
		},
		removeCategorie: function(req, res){
			if (req.query.categorie_id){
				var query = {};
				query._id = req.query.categorie_id;
				Categorie.findOneAndRemove(query, function(err, dbCat){
					if (err) throw err; 
					if (dbCat){
						return res.json({success: true, message: "Categoria removida", reponse: {categorie: dbCat}});
					}else return res.json({success: false, message: "Categoria não encontrada"});
				})
			}else return res.json({success: false, message: "Id não foi passado"});
		},
		getCategories: function(req, res){
			if (req.query.user_id){
				var query = {};
				query._id = req.query.user_id;
				Categorie.find({}, function(err, dbCat){
					if (err) throw err;
					if (dbCat){
						var cat_final = [];
						for (var index in dbCat){
							cat_final.push(dbCat[index]._doc);
						}
						User.findOne(query, function(err, dbUser){
							if (err) throw err;
							if (dbUser){
								for (var i in cat_final){
									for (var index in dbUser.categories){
										if (cat_final[i]._id.toString() == dbUser.categories[index].toString()){
											cat_final[i].is_checked = true;
										}
									}
									if (!cat_final[i].is_checked){
										cat_final[i].is_checked = false;
									}
								}
								return res.json({success: true, message: "Categorias encontradas", response: {categorias: cat_final}});
							}else return res.json({success: false, message: "Usuário não encontrado"});
						})
					}else return res.json({success: false, message: "Não foi encontrada nenhuma categoria"});
				})
			}else return res.json({success: false, message: "Faltam parâmetros"});
		}
	}
}