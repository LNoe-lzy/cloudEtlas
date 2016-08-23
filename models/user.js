//用户模型
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    brithday: String,
    path: String,
    follow: [],    // 关注
    followed: [],   // 被关注
    followedCount: Number,   // 被关注数
    dynamic: []    // 动态
});

var User = mongoose.model('users', UserSchema);

module.exports = User;

//为User添加方法