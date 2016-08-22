module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		userName: String,
	    email: String,
		phoneNumber: String,
		role: { type: String, default: 'client' } //roles: client, manager, employee
	});

	return mongoose.model('User', userSchema);
}