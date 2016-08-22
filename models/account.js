module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var accountSchema = new Schema({
		userName: String,
	    email: String,
		password: String
	});

	return mongoose.model('Account', accountSchema);
}