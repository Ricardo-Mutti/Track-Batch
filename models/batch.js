module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var batchSchema = new Schema({

		productID: String,
		POID: Schema.Types.ObjectId,
		fabDate: Date,
		currentMachine: String,
		duration: String,
		activitiesTime: [String],
		transportTime:[String]
		
	});

	return mongoose.model('Batch', batchSchema);
}