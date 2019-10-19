/*
    Модуль шару DAO (Data Access Object) для роботи зі статтями
*/
const ObjectId = require('mongodb').ObjectID;

class ArticleDAO {

    constructor(conn) {
        this.collection = conn.db('blog').collection('articles');
    }

    findAll() {
        const articles = this.collection.find().sort({date: -1}).toArray();
        return articles;
    }

    findById(id) {
        const objectId = new ObjectId(id);
        const article = this.collection.findOne({_id: objectId});
        return article;
    }

    insert(article) {
        this.collection.insertOne(article);
    }

    insertMany(articles) {
        this.collection.insertMany(articles);
    }

    update(article) {
        const objectId = new ObjectId(article._id);
        this.collection.updateOne(
            {_id: objectId},
            { $set: {'title': article.title, 'description': article.description,
            'text': article.text, 'author': article.author}}
        );
    }

    delete(id) {
        const objectId = new ObjectId(id);
        this.collection.deleteOne({_id: objectId});
    }

}

module.exports.ArticleDAO = ArticleDAO;