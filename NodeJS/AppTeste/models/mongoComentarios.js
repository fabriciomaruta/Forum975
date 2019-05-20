var mongoose = require("mongoose");
conn4 = mongoose.createConnection('mongodb://localhost:27017/comentariosDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var comentariosSchema = new Schema({
    
});
module.exports = conn4.model('comentarios', comentariosSchema);
