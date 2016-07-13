module.exports = function(mongoose){
	var Schema = mongoose.Schema;

	var localSchema = new Schema({
		nome : String,
		descricao : String,
		foto : String,
		coordenadas : {
		  	type: [Number],
		  	index: '2d'
	  	},
	  	tipo : Number,
	  	principaisModalidades : String
	});

	return mongoose.model('Local', localSchema);
}
