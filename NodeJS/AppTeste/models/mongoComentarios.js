var mongoose = require("mongoose");
conn4 = mongoose.createConnection('mongodb://localhost:27017/forumDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var comentariosSchema = new Schema({
    "author": String,
    "content": String,
    "postId": String,
});
module.exports = conn4.model('comentarios', comentariosSchema);
