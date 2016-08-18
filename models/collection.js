var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CollectionSchema = new Schema({
    user: String,
    userId: String,
    fromUser: String,
    time: String,
    info: String,
    path: String,
    head: String
});

var Collection = mongoose.model('collections', CollectionSchema);

module.exports = Collection;