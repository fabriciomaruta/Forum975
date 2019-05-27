var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://localhost:27017/usersDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "name": String,
    "user": String,
    "password": String,
    "nickname":String,
});

module.exports = conn1.model('user', userSchema);
