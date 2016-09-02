module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var POSchema = new Schema({

		client: String,
		orders:  [{
    		productName: String,
			qnt: String
     	}],
		date: { type: Date, default: Date.now },
		POStatus: { type: String, default: 'orded' } //Status da PO -> orded or approved
		
	});

	return mongoose.model('PO', POSchema);
}


// http://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index