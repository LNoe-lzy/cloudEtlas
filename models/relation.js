//存储用户关系
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var RelationSchema = new Schema({
    userId: String, //当前用户
    userName: String,
    userPath: String,
    followId: String,    //被关注的用户
    followName: String,
    followPath: String
});

var Relation = mongoose.model('relations', RelationSchema);

module.exports = Relation;