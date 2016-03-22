var es = require('express-server');

var mongoose = es.db.mongoose;
var WordSchema = es.schemas.word;

module.exports = mongoose.model('Word', WordSchema);