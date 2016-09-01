module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var batchSchema = new Schema({

		productID: String,
		POID: Schema.Types.ObjectId,
		fabDate: Date,
		firstMachine: String,
		currentMachine: { type: String, default: 'none' },
		duration: String,
		activitiesTime: [String],
		transportTime:[String],
		batchStatus: { type: String, default: 'onHold' } //onHold, ready, started, finish. (started = time between ready and first RFID read)
		
	});

	return mongoose.model('Batch', batchSchema);
}