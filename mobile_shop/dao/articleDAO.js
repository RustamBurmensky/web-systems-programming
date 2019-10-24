/*
    Модуль шару DAO (Data Access Object) для роботи зі статтями
*/
const ObjectID = require('mongodb').ObjectID;

class ArticleDAO {

    constructor(db) {
        this.collection = db.collection('articles');
    }

    findAll() {
        return this.collection.find().sort({date: -1}).toArray();
    }

    findById(id) {
        const objectId = new ObjectID(id);
        return this.collection.findOne({_id: objectId});
    }

    insert(article) {
        this.collection.insertOne(article);
    }

    insertMany(articles) {
        this.collection.insertMany(articles);
    }

    update(article) {
        const objectId = new ObjectID(article._id);
        this.collection.updateOne(
            {_id: objectId},
            {
                $set: {
                    'title': article.title, 'description': article.description,
                    'text': article.text, 'author': article.author
                }
            }
        );
    }

    delete(id) {
        const objectId = new ObjectID(id);
        this.collection.deleteOne({_id: objectId});
    }

}

module.exports.ArticleDAO = ArticleDAO;