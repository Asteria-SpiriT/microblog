var express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { 
    title: '首页' 
  });
});

/* GET post page. */
router.get('/post', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET reg page. */
router.get('/reg', (req, res, next) => {
  res.render('reg', {
    title: '用户注册'
  })
});
/* POST reg page. */
router.post('/reg', (req, res, next) => {
  if(req.body.username == '' || req.body.password_repeat == '' ||  req.body.password == ''){
    req.flash('error', '用户名密码不能为空!');
    return res.redirect('/reg');
  }
  // 校验两次密码是否一致
  if(req.body.password_repeat != req.body.password){
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('/reg');
  }
  // 生成密码Hash
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  var newUser = new User({
    name: req.body.username,
    password: password
  });

  // 检查用户名是否已存在
  User.get(newUser.name, (err, user) => {
    if(user){
      err = '该昵称已被使用!';
    }
    if(err){
      req.flash('error', err);
      return res.redirect('/reg');
    }

    // 如果不存在则新增用户
    newUser.save( (err) => {
      if(err){
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功!');
      res.redirect('/');
    });
  });
});

router.get('/user/:username', (req, res, next) => {
  res.send(`user: ${req.params.username}`);
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('login', {
    title: '用户登录'
  });
});

/* POST login page. */
router.post('/login', (req, res, next) => {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  // 判断用户名密码是否存在和正确
  User.get(req.body.username, (err, user) => {
    if(!user){
      req.flash('error', '用户名不存在!');
      return res.redirect('/login');
    }

    if(user.password != password){
      req.flash('error', '用户密码不正确!');
      return res.redirect('/login');
    }

    // 保存用户信息
    req.session.user = user;
    req.flash('success', '登录成功!');
    res.redirect('/');
  })
});

/* GET logout page. */
router.get('/logout', (req, res, next) => {
  res.session.user = null;//清空session
  req.flash('success', '注销成功!');
  res.redirect('/');
});

module.exports = router;
