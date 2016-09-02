module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var batchSchema = new Schema({

		productName: String,
		POID: Schema.Types.ObjectId,
		fabDate: Date,
		qnt: String,
		firstMachine: String,
		currentMachine: { type: String, default: 'none' },
		duration: String,
		activitiesTime: [String],
		transportTime:[String],
		batchStatus: { type: String, default: 'onHold' } //onHold, ready, started, finished. (started = time between ready and first RFID read)
		
	});

	return mongoose.model('Batch', batchSchema);
}