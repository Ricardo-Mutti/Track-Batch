module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var notificationSchema = new Schema({
		type: Number,
		user_id: Schema.Types.ObjectId,
		user_photo: String,
		username: String,
		text: String,
		video_thumb: String,
		video_id: Schema.Types.ObjectId
	});

	return mongoose.model('Notification', notificationSchema);
}
