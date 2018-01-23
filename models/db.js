var settings = require('../settings'),
    MongoClient = require('mongodb').MongoClient;
var _db;

module.exports = {
    connectToDB (callback){
        MongoClient.connect(`mongodb://${settings.host}:${settings.port}/${settings.db}`, (err, client) => {
            _db = client;
            return callback(err, client);
        })
    },
    getDb (){
        return _db;
    }
};