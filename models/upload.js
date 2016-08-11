//文件上传模块
var fs = require('fs');
var Image = require('./image');
var User = require('./user');
var Relaton = require('./relation');

exports.imgUpload = function (tmp, file_name, mime, user, info, head, id, type, req, res) {
   //指定存储位置
    var target_path = 'public/images/'+ type +'/' + file_name;
    var extName = '';
    switch (mime) {
        case 'image/pjpeg':
            extName = 'jpg';
            break;
        case 'image/jpeg':
            extName = 'jpg';
            break;
        case 'image/png':
            extName = 'png';
            break;
        case 'image/x-png':
            extName = 'png';
            break;
    }
    //判断文件是否为图像类型
    if (extName.length == 0) {
        req.flash('error', '只能上传图像!');
        return res.redirect('/');
    }
    //文件移动的目录
    var store_path = target_path + '.' + extName;
    //文件相对路径用于存储于数据库
    var imgpath = '/images/'+ type +'/' + file_name + '.' + extName;
    //移动文件
    fs.rename(tmp, store_path, function (err) {
        if (err) {
            console.log(err);
        }
        //删除临时文件
        fs.unlink(tmp, function () {
            if (err) {
                console.log(err);
            }
        });
    });

    //获取当前的时间
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    //将图像信息存储到数据库
    if (type === 'upload') {
        var newImage = new Image({
            user: user,
            time: time.day,
            info: info,
            path: imgpath,
            head: head,
            userId: id
        });
        newImage.save(function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', '发表成功!');
            res.redirect('/');
        });
    } else if (type === 'user') {
        User.update({
            name: user
        }, {
            $set: {
                path: imgpath
            }
        }, function (err) {
            if (err) {
                console.log(err);
            }
            //修改关注被关注的用户信息
            Relaton.update({
                userName: user
            }, {
                $set: {
                    userPath: imgpath
                }
            }, function (err) {
                Relaton.update({
                    followName: user
                }, {
                    $set: {
                        followPath: imgpath
                    }
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    req.flash('success', '头像上传成功!');
                    res.redirect('/');
                });
            });
        });
    }
};