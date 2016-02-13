module.exports = function(context) {
    var mongoose = context.db.mongoose;

    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var WordSchema = new Schema({
        word: { type: String, require: true }
    });

    return mongoose.model('Word', WordSchema);
};