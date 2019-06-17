var mongoose = require("mongoose");
conn2 = mongoose.createConnection('mongodb://localhost:27017/assuntosDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;

var assuntosSchema = new Schema({
    "name": String,
    "numberOfPosts": Number,
});

module.exports = conn2.model('assuntos', assuntosSchema);
