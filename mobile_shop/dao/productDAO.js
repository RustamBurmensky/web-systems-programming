/*
    Модуль шару DAO (Data Access Object) для роботи з товаром
*/
const ObjectID = require('mongodb').ObjectID;

class ProductDAO {

    constructor(db) {
        this.collection = db.collection('products');
    }

    findAll(productFilter) {
        return this.collection.find(productFilter.generateQuery()).sort({price: 1}).toArray();
    }

    findById(id) {
        const objectId = new ObjectID(id);
        return this.collection.findOne({_id: objectId});
    }

    insert(product) {
        this.collection.insertOne(product);
    }

    insertMany(products) {
        this.collection.insertMany(products);
    }

    update(product) {
        const objectId = new ObjectID(product._id);
        const fieldsToUpdate = {
            'name': product.name, 'description': product.description,
            'price': product.price, 'manufacturer': product.manufacturer,
            'categoryId': product.categoryId
        };
        if (product.image) {
            fieldsToUpdate.image = product.image;
        }
        this.collection.updateOne(
            {_id: objectId},
            {$set: fieldsToUpdate}
        );
    }

    delete(id) {
        const objectId = new ObjectID(id);
        this.collection.deleteOne({_id: objectId});
    }

}

module.exports.ProductDAO = ProductDAO;