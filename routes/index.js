var express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    formidable = require('formidable'),
    fs = require('fs'),
    multer = require('multer'),
    upload = multer({dest: 'public/images/tmp/'}),
    async = require('async');

/*
   引入模型
   User 用户模型
   Image 动态模型
   Relation 关系模型
   Collection 收藏模型
   Tool 工具模块
   upload 文件上传模块
 */
var User = require('../models/user'),
    Image = require('../models/image'),
    Collection = require('../models/collection'),
    Tool = require('../models/tool'),
    imgUpload = require('../models/upload');

/* GET home page. */
router.get('/', function(req, res) {
  var imgArray = [],
      currentUser = req.session.user;
  // 如果当前的session无用户存在,曾返回登录界面
  if (!currentUser) {
    return res.redirect('/login');
  }
  User.findById(currentUser._id, function (err, user) {
    if (err) {
      console.log(err);
    }
    //返回用户动态数,并以发布的时间倒叙返回输出
    Image.find({
      user: currentUser.name
    }).sort({
      '_id': -1
    }).exec(function (err, img) {
      if (err) {
        console.log(err);
      }
      //返回用户发布的动态数
      Image.find({
        user: currentUser.name
      }).count().exec(function (err, c) {
        if (err) {
          console.log('err');
        }
        User.find(null).sort({
          'followed': -1
        }).limit(3).exec(function (err, rec) {
          if (err) {
            console.log(err);
          }
          Collection.find({
            user: currentUser.name
          }).count().exec(function (err, col) {
            if (err) {
              console.log(err);
            }
            // 喜爱推荐
            Image.find(null).sort({
              'love': -1
            }).limit(3).exec(function (err, l) {
              if (err) {
                console.log(err);
              }
              // 将用户关注的用户与用户的数据通过数组返回渲染
              var imgAsync = function () {
                async.mapSeries(user.follow, function (elem, callback) {
                  Image.find({
                    userId: elem.followId
                  }, function (err, fImg) {
                    if (err) {
                      return callback(err);
                    }
                    fImg.forEach(function (e) {
                      imgArray.push(e);
                    });
                    callback(null);
                  });
                }, function (err) {
                  if (err) {
                    console.log(err);
                  }
                  img.forEach(function (e) {
                    imgArray.push(e);
                  });
                  res.render('index', {
                    title: '云图',
                    user: user,
                    imgs: imgArray.sort(Tool.keysort('_id', true)),
                    count: c,
                    love: l,
                    collection: col,
                    recommend: rec,
                    error: req.flash('error').toString(),
                    success: req.flash('success').toString()
                  });
                });
              };
              imgAsync(function (err) {
                if (err) {
                  console.log(err);
                }
              });
            });
          });
        });
      });
    });
  });
});

//get user page
router.get('/u/:id', function(req, res) {
  //通过Id找到该用户的信息
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    }
    Image.find({
      userId: user._id
    }, function (err, img) {
      if (err) {
        console.log(err);
      }
      User.find(null).sort({
        'followed': -1
      }).limit(3).exec(function (err, rec) {
        if (err) {
          console.log(err);
        }
        Image.find(null).sort({
          'love': -1
        }).limit(3).exec(function (err, l) {
          User.findById(user.follow[0].followId, function (err, followInfo) {
            if (err) {
              console.log(err);
            }
            User.findById(user.followed[0].followedId, function (err, followedInfo) {
              if (err) {
                console.log(err);
              }
              res.render('user', {
                title: '云图',
                user: user,
                currentUser: req.session.user,
                imgs: img,
                follow: user.follow.length,
                followInfo: followInfo,
                followed: user.followed.length,
                followedInfo: followedInfo,
                recommend: rec,
                love: l,
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
  var followArray = [];
  User.findById(req.session.user._id, function (err, user) {
    if (err) {
      console.log(err);
    }
    User.find(null).sort({
      'followed': -1
    }).limit(3).exec(function (err, rec) {
      if (err) {
        console.log(err);
      }
      Image.find(null).sort({
        'love': -1
      }).limit(3).exec(function (err, l) {
        if (err) {
          console.log(err);
        }
        var followAsync = function () {
          async.mapSeries(user.follow, function (elem, callback) {
            User.findById(elem.followId, function (err, u) {
              if (err) {
                console.log(err);
              }
              followArray.push(u);
              callback(null);
            })
          }, function (err) {
            if (err) {
              console.log(err);
            }
            res.render('follow', {
              title: '云图',
              user: user,
              follow: user.follow.length,
              followed: user.followed.length,
              followInfo: followArray,
              recommend: rec,
              love: l,
              error: req.flash('error').toString(),
              success: req.flash('success').toString()
            });
          });
        };
        followAsync(function (err) {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  });
});

//被关注
router.get('/followed', function (req, res){
  var followedArray = [];
  User.findById(req.session.user._id, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (err) {
      console.log(err);
    }
    User.find(null).sort({
      'followed': -1
    }).limit(3).exec(function (err, rec) {
      if (err) {
        console.log(err);
      }
      Image.find(null).sort({
        'love': -1
      }).limit(3).exec(function (err, l) {
        if (err) {
          console.log(err);
        }
        var followedAsync = function () {
          async.mapSeries(user.follow, function (elem, callback) {
            User.findById(elem.followId, function (err, u) {
              if (err) {
                console.log(err);
              }
              followedArray.push(u);
              callback(null);
            })
          }, function (err) {
            if (err) {
              console.log(err);
            }
            res.render('followed', {
              title: '云图',
              user: user,
              follow: user.follow.length,
              followed: user.followed.length,
              followedInfo: followedArray,
              recommend: rec,
              love: l,
              error: req.flash('error').toString(),
              success: req.flash('success').toString()
            });
          });
        };
        followedAsync(function (err) {
          if (err) {
            console.log(err);
          }
        });
      });
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
  var currentUser = req.session.user,
      info = req.body.info,
      username = currentUser.name,
      userhead = currentUser.path,
      userId = currentUser._id,
      tmp_path = req.file.path,
      file_name = req.file.filename,
      mimeType = req.file.mimetype;
  imgUpload.imgUpload(tmp_path, file_name, mimeType, username, info, userhead, userId, 'upload', req, res);
});

//删除发表的动态
router.get('/delete', function (req, res) {
  Image.remove({
    path: req.query.imgPath,
    user: req.query.imgUser
  }, function (err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', '删除成功!');
    res.redirect('/u/' + req.session.user._id);
  });
});

//编辑用户信息
router.post('/editinfo', function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, uflag) {
    if (err) {
      console.log(err);
    }
    // 判断用户名是否存在
    if (uflag) {
      req.flash('error', '用户名已存在!');
      res.redirect('/u/' + req.session.user._id);
    } else {
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
        req.session.user = null;
        req.flash('success', '修改信息成功!');
        res.redirect('/logout');
      });
    }
  });
});

//上传用户头像
router.post('/edithead', upload.single('userhead'), function (req, res) {
  var username = req.session.user.name;
  var tmp_path = req.file.path;
  var file_name = req.file.filename;
  var mimeType = req.file.mimetype;
  imgUpload.imgUpload(tmp_path, file_name, mimeType, username, null, null, null, 'user', req, res);
});

//用户搜索
router.get('/search', function (req, res) {
  User.findById(req.session.user._id, function (err, user) {
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
  })
});

//用户关注
router.get('/attention/:to', function (req, res) {
  var attentionTo = req.params.to;
  var currentUser = req.session.user;
  User.findById(attentionTo, function (err, u) {
    if (err) {
      console.log(err);
    }
    // 更新当前用户的关注信息
    User.update({
      _id: currentUser._id
    }, {
      $push: {
        'follow': {
          userId: currentUser._id,
          followId: attentionTo
        }
      }
    }, function (err) {
      if (err) {
        console.log(err);
      }
      User.update({
        _id: u._id
      }, {
        $inc: {
          'followedCount': 1
        }
      }, function (err) {
        if (err) {
          console.log(err);
        }
        // 更新被关注者的信息
        User.update({
          _id: attentionTo
        }, {
          $push: {
            'followed': {
              userId: attentionTo,
              followedId: currentUser._id
            }
          }
        }, function (err) {
          if (err) {
            console.log(err);
          }
          req.flash('success', '关注成功!');
          res.redirect('/');
        });
      });
    });
  })
});

//取消关注
router.get('/attentionRemove/:to', function (req, res) {
  var attentionTo = req.params.to;
  var currentUser = req.session.user;
  User.findById(attentionTo, function (err, u) {
    if (err) {
      console.log(err);
    }
    User.update({
      _id: currentUser._id
    }, {
      $pull: {
        'follow': {
          userId: currentUser._id,
          followId: attentionTo
        }
      }
    }, function (err) {
      if (err) {
        console.log(err);
      }
      User.update({
        _id: u._id
      }, {
        $inc: {
          'followedCount': -1
        }
      }, function (err) {
        if (err) {
          console.log(err);
        }
        User.update({
          _id: u._id
        }, {
          $pull: {
            'followed': {
              userId: attentionTo,
              followedId: currentUser._id
            }
          }
        }, function (err) {
          if (err) {
            console.log(err);
          }
          req.flash('success', '取消关注成功');
          res.redirect('/');
        });
      });
    });
  })
});

// 动态喜欢
router.get('/love', function (req, res) {
  var user = req.query.user,
      id = req.query.id;
  Image.update({
    user: user,
    _id: id
  }, {
    $inc: {
      'love': 1
    }
  }, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

// 转发
router.post('/forward', function (req, res) {
  var data = req.body,
      time = Tool.getTime();
  var forward = '<span class="forward-span">转:' + data.user + '</span>';
  var newImage = new Image({
    user: req.session.user.name,
    userId: req.session.user._id,
    time: time.day,
    info: forward + data.info,
    path: data.path,
    head: req.session.user.path
  });
  newImage.save(function (err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', '转发成功!');
    return res.redirect('/');
  });
});

// 评论
router.post('/comment', function (req, res) {
  var currentUser = req.session.user;
  Image.update({
    user: req.body.user
  }, {
    $push: {'comment': {
      commentUser: currentUser.name,
      commentInfo: req.body.text,
      commentHead: currentUser.path,
      commentTo: req.body.commentTo
    }}
  }, function (err) {
    if (err) {
      console.log(err);
    }
    User.update({
      name: req.body.user
    }, {
      $push: {'dynamic': {
          dynamicUser: currentUser.name,
          dynamicInfo: req.body.text
        }
      }
    }, function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  });
});

// 动态
router.get('/dynamic', function(req, res) {
  //通过Id找到该用户的信息
  User.findById(req.session.user._id, function (err, user) {
    User.find(null).sort({
      'followed': -1
    }).limit(3).exec(function (err, rec) {
      if (err) {
        console.log(err);
      }
      Image.find(null).sort({
        'love': -1
      }).limit(3).exec(function (err, l) {
        User.findById(user.follow[0].followId, function (err, followInfo) {
          if (err) {
            console.log(err);
          }
          User.findById(user.followed[0].followedId, function (err, followedInfo) {
            if (err) {
              console.log(err);
            }
            res.render('dynamic', {
              title: '云图',
              user: user,
              currentUser: req.session.user,
              follow: user.follow.length,
              followInfo: followInfo,
              followed: user.followed.length,
              followedInfo: followedInfo,
              recommend: rec,
              love: l,
              error: req.flash('error').toString(),
              success: req.flash('success').toString()
            });
          });
        });
      });
    });
  });
});

// 收藏
router.post('/collection', function (req, res) {
  var time = Tool.getTime(),
      info = '<span class="forward-span">收藏自:' + req.body.user + '</span>' + req.body.info;
  var newCollection = new Collection({
    user: req.session.user.name,
    userId: req.session.user._id,
    fromUser: req.body.user,
    imgId: req.body.imgId,
    time: time.day,
    info: info,
    path: req.body.path,
    head: req.session.user.path
  });
  newCollection.save(function (err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', '收藏成功!');
    res.redirect('/collection');
  });
});

// get collection page
router.get('/collection', function(req, res) {
  //通过Id找到该用户的信息
  User.findById(req.session.user._id, function (err, user) {
    if (err) {
      console.log(err);
    }
    //返回该用户的动态
    Collection.find({
      user: user.name
    }, function (err, img) {
      if (err) {
        console.log(err);
      }
      User.find(null).sort({
        'followed': -1
      }).limit(3).exec(function (err, rec) {
        if (err) {
          console.log(err);
        }
        User.findById(user.follow[0].followId, function (err, followInfo) {
          if (err) {
            console.log(err);
          }
          User.findById(user.followed[0].followedId, function (err, followedInfo) {
            if (err) {
              console.log(err);
            }
            Image.find(null).sort({
              'love': -1
            }).limit(3).exec(function (err, l) {
              if (err) {
                console.log(err);
              }
              res.render('collection', {
                title: '云图',
                user: user,
                currentUser: req.session.user,
                imgs: img,
                follow: user.follow.length,
                followInfo: followInfo,
                followed: user.followed.length,
                followedInfo: followedInfo,
                recommend: rec,
                love: l,
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

// 删除收藏
router.get('/colDelete', function (req, res) {
  Collection.remove({
    user: req.session.user.name,
    imgId: req.query.imgId
  }, function (err) {
    if (err) {
      console.log(err);
    }
    req.flash('success', '收藏删除成功!');
    res.redirect('/collection');
  });
});


module.exports = router;