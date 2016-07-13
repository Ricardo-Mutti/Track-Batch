module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var accountSchema = new Schema({
		username: String,
		password: String,
	    facebook_id: String,
	    email: String,
	    admin: Boolean
	});

	return mongoose.model('Account', accountSchema);
}