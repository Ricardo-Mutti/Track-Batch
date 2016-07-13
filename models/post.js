module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var postSchema = new Schema({
    nome: String,
    descricao: String,
    commentUsers: [Schema.Types.ObjectId],
    likes: Number,
    commentsCount: Number,
    videoUrl: String,
    thumbUrl: String,
    postDate: Date,
    categories: [Schema.Types.ObjectId], 
    source: String, //Source é uma referencia para a fonte do vídeo, pode ser utilizado para "pegar" o video de forma inteligente
    status: Number, //Status é um int 
    views: {type: Number, default : 0} //Views pode implicar em muitos writes
  });

  return mongoose.model('Post', postSchema);
}
