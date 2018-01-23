var mongodb = require('./db'),
    settings = require('../settings');

function Post(username, content, time) {
    this.user = username;
    this.content = content;
    if(time){
        this.time = time.toLocaleString();
    }else{
        let now = new Date();
        this.time = now.toLocaleString();
    }
}

Post.prototype.save = function save(callback) {
    var post = {
        user: this.user,
        content: this.content,
        time: this.time
    };

    mongodb.connectToDB( (err, client) => {
        if(err) return callback(err);

        let db = client.db(settings.db);

        db.collection('posts', (err, collection) => {
            if(err){
                client.close();
                return callback(err);
            }
            collection.ensureIndex('user');
            console.log(post);
            collection.insert(post, {safe: true}, (err, post) => {
                client.close();
                callback(err, post);
            })
        })
    })
}

Post.get = function (username, callback) {
    mongodb.connectToDB( (err, client) => {
        if(err) {
            client.close();
            return callback(err);
        }

        let db = client.db(settings.db);
        
        db.collection('posts', (err, collection) => {
            let query = {};
            if(username){
                query.user = username;
            }
            collection.find(query).sort({time: -1}).toArray((err, docs) => {
                client.close();
                if(err) return callback(err, null);

                var posts = [];
                docs.forEach(item => {
                    var post = new Post(item.user, item.content, item.time);
                    posts.push(post);
                });
                callback(null, posts)
            })
        })
    })
}

module.exports = Post;