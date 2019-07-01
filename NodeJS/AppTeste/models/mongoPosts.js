var mongoose = require("mongoose");
conn3 = mongoose.createConnection('mongodb://localhost:27017/postsDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var postsSchema = new Schema({
    "name": String,
    "content": String,
    "owner": String,
    "comments":Array,
    "assunto": String,
});
module.exports = conn3.model('posts', postsSchema);
