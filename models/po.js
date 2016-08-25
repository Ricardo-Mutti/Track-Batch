module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var POSchema = new Schema({

		client: String,
		orders:  [{
    		productID: String,
			qnt: String,
			status: { type: String, default: 'orded' } //orded, approved, started, inProgress, finish. (inProgess = time between started and first RFID read)
     	}],
		date: Date
		
	});

	return mongoose.model('PO', POSchema);
}


// http://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index