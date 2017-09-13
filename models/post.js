var mongodb = require('./db');

function Post(post) {
    this.title = post.title;
    this.time = post.time;
};

module.exports = Post;

// 存储用户信息
Post.prototype.save = function (callback) {
    var post = {
        title: this.title,
        time: this.time
    };

    // 打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取posts集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将用户数据插入users集合
            collection.insert(post, {
                safe: true
            }, function (err, post) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

// 读取用户信息
Post.get = function(title, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(title){
                query.title = title;
            }
            collection.find(query).sort({
                time:-1
            }).toArray(function (err, docs){
                mongodb.close();
                if (err){
                    return callback(err);
                }
                callback(null,docs);
            })
        });
    });
};