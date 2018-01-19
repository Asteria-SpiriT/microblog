var settings = require('../settings'),
    MongoClient = require('mongodb').MongoClient,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

module.exports = new MongoClient(new Server(settings.host, settings.port));