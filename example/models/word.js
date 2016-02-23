module.exports = function(context) {
    var mongoose = context.db.mongoose;
    var WordSchema = context.schemas.word;

    return mongoose.model('Word', WordSchema);
};