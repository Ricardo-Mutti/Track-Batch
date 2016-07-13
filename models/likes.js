module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var likesSchema = new Schema({
		post_id: Schema.Types.ObjectId,
		user_id: Schema.Types.ObjectId
	});

	return mongoose.model('Likes', likesSchema);
}
