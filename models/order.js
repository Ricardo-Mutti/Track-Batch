module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var orderSchema = new Schema({

		productID: String,
		qnt: String,
		status: { type: String, default: 'orded' } //orded, approved, started, inProgress, finish. (inProgess = time between started and first RFID read)
		
	});

	return mongoose.model('Order', oderSchema);
}