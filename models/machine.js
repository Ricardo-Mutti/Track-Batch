module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var machineSchema = new Schema({

		machineName: String,
	    imageUrl: String,
		color: String,
		last30Days: [String]
		
	});

	return mongoose.model('Machine', machineSchema);
}