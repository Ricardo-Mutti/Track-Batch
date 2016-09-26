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
		ETC: String,
		type: { type: String, default: 'photo' } //Pode ser foto ou blueprint 
		
	});

	return mongoose.model('Product', productSchema);
}