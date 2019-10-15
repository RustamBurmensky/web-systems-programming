/*
    Модуль шару DAO (Data Access Object) для роботи зі статтями
*/
const ObjectId = require('mongodb').ObjectID;

class ArticleDAO {

    constructor(conn) {
        this.collection = conn.db('blog').collection('articles');
    }

    findAll() {
        const articles = this.collection.find().toArray();
        return articles;
    }

    findById(id) {
        const objectId = new ObjectId(id);
        const article = this.collection.findOne({_id: objectId});
        return article;
    }

}

module.exports.ArticleDAO = ArticleDAO;