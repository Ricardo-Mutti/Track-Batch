module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var accountSchema = new Schema({
		username: String,
		password: String,
	    email: String,
	    role: Boolean
	});

	return mongoose.model('Account', accountSchema);
}