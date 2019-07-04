var mongoose = require("mongoose");
conn3 = mongoose.createConnection('mongodb://localhost:27017/forumDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var postsSchema = new Schema({
    "name": String,
    "content": String,
    "assunto": String,
    "author": String,
    "numberOfComments": Number,
});
module.exports = conn3.model('posts', postsSchema);
