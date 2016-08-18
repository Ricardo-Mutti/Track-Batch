module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		name: String,
	    email: String,
		phoneNumber: String,
		role: String
	});

	return mongoose.model('User', userSchema);
}