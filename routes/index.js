var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var formidable = require('formidable');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'public/images/tmp/'});

var imgUpload = require('../models/upload');

/*
   引入模型
   User 用户模型
   Image 动态模型
   Relation 关系模型
 */
var User = require('../models/user');
var Image = require('../models/image');
var Relation = require('../models/relation');

/* GET home page. */
router.get('/', function(req, res) {
  User.findOne({
    name: req.session.user.name
  }, function (err, user) {
    if (err) {
      console.log(err);
    }
    //返回用户动态数,并以发布的时间倒叙返回输出
    Image.find({
      user: req.session.user.name
    }).sort({
      '_id': -1
    }).exec(function (err, img) {
      if (err) {
        console.log(err);
      }
      //返回用户发布的动态数
      Image.find({
        user: req.session.user.name
      }).count().exec(function (err, c) {
        if (err) {
          console.log('err');
        }
        //返回用户的关注数
        Relation.find({
          userId: user._id
        }).count().exec(function (err, r) {
          if (err) {
            console.log(err);
          }
          res.render('index', {
            title: '云图',
            user: user,
            imgs: img,
            count: c,
            relation: r,
            error: req.flash('error').toString(),
            success: req.flash('success').toString()
          });
        });
      });
    });
  });
});

//get user page
router.get('/u/:id', function(req, res) {
  //通过Id找到该用户的信息
  User.findOne({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      console.log(err);
    }
    //返回该用户的动态
    Image.find({
      user: user.name
    }, function (err, img) {
      if (err) {
        console.log(err);
      }
      //返回该用户的关注
      Relation.find({
        userId: user._id
      }).count().exec(function (err, r) {
        if (err) {
          console.log(err);
        }
        Relation.findOne({
          userId: user._id
        }, function (err, fi) {
          if (err) {
            console.log(err);
          }
          //返回被关注数
          Relation.find({
            followId: user._id
          }).count().exec(function (err, cd) {
            if (err) {
              console.log(err);
            }
            Relation.findOne({
              followId: user._id
            }, function (err, fid) {
              if (err) {
                console.log(err);
              }
              res.render('user', {
                title: '云图',
                user: user,
                currentUser: req.session.user,
                imgs: img,
                follow: r,
                followInfo: fi,
                followed: cd,
                followedInfo: fid,
                error: req.flash('error').toString(),
                success: req.flash('success').toString()
              });
            });
          });
        });
      });
    });
  });
});

//get follow page
router.get('/follow', function (req, res){
  User.findOne({
    name: req.session.user.name
  }, function (err, user) {
    if (err) {
      console.log(err);
    }
    Relation.find({
      userId: user._id
    }).count().exec(function (err, c) {
      if (err) {
        console.log(err);
      }
      Relation.find({
        userId: user._id
      }, function (err, f) {
        if (err) {
          console.log(err);
        }
        Relation.find({
          followId: user._id
        }).count().exec(function (err, cd) {
          if (err) {
            console.log(err);
          }
          res.render('follow', {
            title: '云图',
            user: user,
            follow: c,
            followed: cd,
            followInfo: f,
            error: req.flash('error').toString(),
            success: req.flash('success').toString()
          });
        });
      })
    });
  });
});

//被关注
router.get('/followed', function (req, res){
  User.findOne({
    name: req.session.user.name
  }, function (err, user) {
    if (err) {
      console.log(err);
    }
    Relation.find({
      userId: user._id
    }).count().exec(function (err, c) {
      if (err) {
        console.log(err);
      }
      Relation.find({
        followId: user._id
      }, function (err, f) {
        if (err) {
          console.log(err);
        }
        Relation.find({
          followId: user._id
        }).count().exec(function (err, cd) {
          if (err) {
            console.log(err);
          }
          res.render('followed', {
            title: '云图',
            user: user,
            follow: c,
            followed: cd,
            followedInfo: f,
            error: req.flash('error').toString(),
            success: req.flash('success').toString()
          });
        });
      })
    });
  });
});

//get signup  page
router.get('/signup', function (req, res) {
  res.render('signup', {
    title: '欢迎来到云图',
    user: req.session.user,
    error: req.flash('error').toString(),
    success: req.flash('success').toString()
  });
});

//注册
router.post('/signup', function (req, res) {
  //检查用户是否存在
  User.findOne({
    name: req.body.name
  }, function (err, u) {
    if (err) {
      console.log(err);
    } else if (u) {
      req.flash('error', '用户已存在!');
      res.redirect('/signup');
    } else {
      //注册用户数据
      var password = req.body.password,
          passwordrep = req.body.passwordrep,
          md5 = crypto.createHash('md5');
      if (passwordrep !== password) {
        req.flash('error', '两次输入的密码不一致!')
      }
      password = md5.update(password).digest('hex');
      var userData = {
        name: req.body.name,
        email: req.body.email,
        password: password
      };
      var user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          req.session.user = user;
          res.redirect('/');
        }
      });
    }
  });
});

//get login  page
router.get('/login', function (req, res) {
  res.render('login', {
    title: '欢迎来到云图',
    user: req.session.user,
    error: req.flash('error').toString(),
    success: req.flash('success').toString()
  });
});

//登录
router.post('/login', function (req, res) {
  var password = req.body.password;
  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');
  User.findOne({
    name: req.body.name
  }, function (err, u) {
    if (err) {
      console.log(err);
    } else if (!u) {
      req.flash('error', '用户不存在!');
      res.redirect('/login');
    } else if (u.password !== password) {
      req.flash('error', '密码错误!');
      res.redirect('/login');
    } else {
      req.session.user = u;
      res.redirect('/');
    }
  })
});

//注销用户
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '退出成功!');
  res.redirect('/login');
});

//发布动态
router.post('/send', upload.single('image'), function (req, res){
  var info = req.body.info;
  var username = req.session.user.name;
  var tmp_path = req.file.path;
  var file_name = req.file.filename;
  var mimeType = req.file.mimetype;
  imgUpload.imgUpload(tmp_path, file_name, mimeType, username, info, 'upload', req, res);
});

//删除发表的动态
router.get('/delete', function (req, res) {
  Image.remove({
    path: req.query.imgPath
  }, function (err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', '删除成功!');
    res.redirect('/');
  });
});

//编辑用户信息
router.post('/editinfo', function (req, res) {
  var currentUser = req.session.user;
  var editData = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    brithday: req.body.brithday
  };
  User.update({
    name: currentUser.name
  }, {
    $set: {
      name: editData.name,
      email: editData.email,
      address: editData.address,
      brithday: editData.brithday
    }
  }, function (err) {
    if (err) {
      console.log(err);
    }
    //修改关注被关注的用户信息
    Relaton.update({
      userId: currentUser._id
    }, {
      $set: {
        userName: editData.name
      }
    }, function (err) {
      Relaton.update({
        followId: currentUser._id
      }, {
        $set: {
          followName: editData.name
        }
      }, function (err) {
        if (err) {
          console.log(err);
        }
        req.session.user = null;
        req.flash('success', '修改信息成功!');
        res.redirect('/logout');
      });
    });
  });
});

//上传用户头像
router.post('/edithead', upload.single('userhead'), function (req, res) {
  var username = req.session.user.name;
  var tmp_path = req.file.path;
  var file_name = req.file.filename;
  var mimeType = req.file.mimetype;
  imgUpload.imgUpload(tmp_path, file_name, mimeType, username, null, 'user', req, res);
});

//用户搜索
router.get('/search', function (req, res) {
  User.findOne({
    name: req.session.user.name
  }, function (err, user) {
    if (err) {
      console.log(err);
    }
    var keyword = req.query.search;
    var pattern = new RegExp("^.*" + keyword + ".*$", "i");
    User.find({
      name: pattern
    }, function (err, u) {
      if (err) {
        console.log(err);
      }
      res.render('search', {
        title: '搜索结果',
        searchs: u,
        user: user,
        error: req.flash('error').toString(),
        success: req.flash('success').toString()
      });
    });
  });
});
//用户关注
router.get('/attention/:to', function (req, res) {
  var attentionTo = req.params.to;
  var currentUser = req.session.user;
  User.findOne({
    _id: attentionTo
  }, function (err, u) {
    if (err) {
      console.log(err);
    }
    var newRelation = new Relation({
      userId: currentUser._id,
      userName: currentUser.name,
      userPath: currentUser.path,
      followId: attentionTo,
      followName: u.name,
      followPath: u.path
    });
    newRelation.save(function (err) {
      if (err) {
        console.log(err);
      }
      req.flash('success', '关注成功!');
      res.redirect('/');
    });
  });
});
//取消关注
router.get('/attentionRemove/:to', function (req, res) {
  var attentionTo = req.params.to;
  var currentUser = req.session.user;
  User.findOne({
    _id: attentionTo
  }, function (err, u) {
    if (err) {
      console.log(err);
    }
    Relation.remove({
      userId: currentUser._id,
      userName: currentUser.name,
      userPath: currentUser.path,
      followId: attentionTo,
      followName: u.name,
      followPath: u.path
    }, function (err) {
      if (err) {
        console.log(err);
      }
      req.flash('success', '取消关注成功');
      res.redirect('/');
    });
  });
});

module.exports = router;
