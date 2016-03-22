var mongoose = require('express-server').db.mongoose;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var WordSchema = new Schema({
    word: { type: String, required: true }
});

module.exports = WordSchema;