var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//引入模型
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: '云图',
    user: req.session.user,
    error: req.flash('error').toString(),
    success: req.flash('success').toString()
  });
});
//get user page
router.get('/user', function(req, res) {
  res.render('user', {
    title: '云图',
    user: req.session.user,
    error: req.flash('error').toString(),
    success: req.flash('success').toString()
  });
});

//get follow page
router.get('/follow', function (req, res){
  res.render('follow', {
    title: '云图',
    user: req.session.user,
    error: req.flash('error').toString(),
    success: req.flash('success').toString()
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

module.exports = router;
