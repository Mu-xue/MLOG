var crypto = require('crypto');
User = require('../models/user.js');
Post = require('../models/post.js');
var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/articles/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype!='text/html'){
            req.flash('error', '文件类型不对');
            cb(null, false);
        }
        else {
            cb(null, true);
        }
    }
});


/* GET home page. */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {user: req.session.user});
    });

    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            description: '',
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            user:req.session.user
        });
    });

    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];

        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致');
            return res.redirect('/reg');
        }

        // 生成密码的md5值
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password
        });

        // 检查用户名是否已经存在
        User.get(newUser.name, function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '昵称已经存在');
                return res.redirect('/reg');

            }
            newUser.save(function (err, user) {
                if (err) {
                      req.flash('error', err);
                      return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功！');
                res.redirect('/reg');
             });
        });
    });

    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            description: '',
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            user:req.session.user
        });
    });
    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
        // 生成密码的md5值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');
        // 检查用户名是否已经存在
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在！');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误！');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '');
            res.redirect('/');
        });
    });
    
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });

    app.get('/post', checkLogin);
    app.get('/post', checkHost);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            description: '',
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            user:req.session.user
        })
    });

    app.post('/post', checkLogin);
    app.post('/post', checkHost);
    app.post('/post', upload.single('web'), function (req, res) {
        var post = new Post(req.body,req.file);
        post.save(function (err) {
            if(err) {
                req.flash ('error', err);
                return res.redirect('/');
            }
            req.flash('success','发布成功！');
            res.redirect('/post');
        })
    });

    app.get('/article', function (req, res){
        Post.get(null, function (err, posts){
            if (err){
                posts = [];
            }
             res.render('article', {
                title: '文章',
                description: '',
                user: req.session.user,
                posts: posts
            });
        });
    });

    app.get('/article/:index', function (req,res) {
        console.log(req.params.index);
        Post.get(null, function (err, posts){
            if (err){
                posts = [];
            }
             res.render('singleArticle', {
                title: '',
                description: '',
                user: req.session.user,
                posts: posts,
                index: req.params.index
            });
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            res.flash('error','未登录！');
            res.redirect('/login');
        }
        next();
    };

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            res.redirect('back');
        }
        next();
    }

    function checkHost (req, res, next) {
        if(req.session.user.name != "123") {
            res.redirect('back');
        }
        next();
    }
};
