//用户发表动态模块
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ImageSchema = new Schema({
    user: String,
    time: String,
    info: String,
    path: String
});

var Image = mongoose.model('images', ImageSchema);

module.exports = Image;