module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var productSchema = new Schema({

		productName: String,
		imageUrl: String,
		subProduct: [{
		  productName: String,
	      qnt: String
     	}],
		activities: [String],
		price: String,
		ETC: String
		
	});

	return mongoose.model('Product', productSchema);
}