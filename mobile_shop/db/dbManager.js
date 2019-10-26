/*
    Клас-менеджер для з'єднання з БД dbManager.js
*/
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

var db;

function connect(callback) {
    // Екземпляр клієнта MongoDB
    const mongoClient = new MongoClient(config.db.url, config.db.options);
    // З'єднання з БД
    mongoClient.connect((err, conn) => {
        db = conn.db(config.db.name);
        callback(err, conn);
    });
}

function getDb() {
    return db;
}

module.exports = {
    connect,
    getDb
};