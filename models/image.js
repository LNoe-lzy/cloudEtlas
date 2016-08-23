//用户发表动态模块
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
    user: String,
    userId: String,
    time: String,
    info: String,
    path: String,
    head: String,
    love: Number,
    comment: []
});

var Image = mongoose.model('images', ImageSchema);

module.exports = Image;