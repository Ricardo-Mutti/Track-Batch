module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var subProductSchema = new Schema({

		productID: String,
		subProduct: [String]
	
		
	});

	return mongoose.model('SubProduct', subProductSchema);
}