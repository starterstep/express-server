var mongoose = require('../db').mongoose;
var WordSchema = require('../schemas').word;

module.exports = mongoose.model('Word', WordSchema);