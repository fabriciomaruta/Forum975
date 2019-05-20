var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://localhost:27017/forumDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "name": String,
    "login": String,
    "password": String,
    "nickname":String,
});

var postSchema = new Schema({
    "name": String,
    "content": String,
    "owner": String,
    "comments":Array,
});

module.exports = conn1.model('post', postSchema);
module.exports = conn1.model('usuario', userSchema);
