module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var categorieSchema = new Schema({
		name: String
	});

	return mongoose.model('Categorie', categorieSchema);
}
