module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
  	username: String,
    first_name: String,
    last_name: String,
    email: String,
    photo: String,
    cover_photo: String,
    facebook_id: String,
    device: String,
    token: String,
    followers: [Schema.Types.ObjectId],
    following: [Schema.Types.ObjectId],
    likes: [Schema.Types.ObjectId],
    posts: [Schema.Types.ObjectId],
    categories: [Schema.Types.ObjectId]
  });

  return mongoose.model('User', userSchema);
}
