/*
    Модуль шару DAO (Data Access Object) для роботи з категоріями
*/
class CategoryDAO {

    constructor(db) {
        this.collection = db.collection('categories');
    }

    findAll() {
        return this.collection.find().sort({name: 1}).toArray();
    }

    findById(categoryId) {
        return this.collection.findOne({'categoryId': categoryId});
    }

    insert(category) {
        this.collection.insertOne(category);
    }

    insertMany(categories) {
        this.collection.insertMany(categories);
    }

    update(category) {
        this.collection.updateOne(
            {categoryId: category.categoryId},
            {$set: {'name': category.name}}
        );
    }

    delete(categoryId) {
        this.collection.deleteOne({'categoryId': categoryId});
    }

}

module.exports.CategoryDAO = CategoryDAO;