//用户模型
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    brithday: String,
    path: String,
    follow: [],    //关注
    followed: Number   //被关注
});

var User = mongoose.model('users', UserSchema);

module.exports = User;

//为User添加方法