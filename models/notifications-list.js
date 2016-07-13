module.exports = function(mongoose){

	var Schema = mongoose.Schema;

	var notifications_listSchema = new Schema({
		user_id: Schema.Types.ObjectId,
		notifications: [Schema.Types.ObjectId],
		unread_count: Number
	});

	return mongoose.model('Notifications_list', notifications_listSchema);
}
