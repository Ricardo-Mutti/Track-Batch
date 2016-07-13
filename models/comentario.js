module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var comentarioSchema = new Schema({
		user_id: Schema.Types.ObjectId,
		post_id: Schema.Types.ObjectId,
		comment: String,
		date: Date,
		username: String
	});

	return mongoose.model('Comentario', comentarioSchema);
}
