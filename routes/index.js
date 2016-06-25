var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: '云图'
  });
});
//get user page
router.get('/user', function(req, res) {
  res.render('user', {
    title: '云图'
  });
});
//get follow page
router.get('/follow', function (req, res){
  res.render('follow', {
    title: '云图'
  });
});
//get login signup page
router.get('/form', function (req, res) {
  res.render('form', {
    title: '欢迎来到云图'
  });
});

module.exports = router;
