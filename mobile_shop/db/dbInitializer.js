/*
    Модуль для початкової ініціалізації бази даних
*/
const fs = require('fs');

class DbInitializer {

    constructor(dbManager, context) {
        this.dbManager = dbManager;
        this.context = context;
    }

    checkIfInitNecessary(callback) {
        const db = this.dbManager.getDb();
        db.collections((err, collections) => {
            callback(err, collections.length == 0);
        });
    }

    initializeIfNeeded() {
        this.checkIfInitNecessary((err, isInitNecessary) => {
            if (err) {
                console.error(err);
            }
            if (isInitNecessary) {
                this.initializeCollections();
            } 
        });
    }

    initializeCollections() {
        console.log('Initializing DB...');
        const rawIntialData = fs.readFileSync('./public/json/initialData.json');
        const initialData = JSON.parse(rawIntialData);
        this.initializeCategories(initialData);
        this.initializeProducts(initialData);
        this.initializeUsers(initialData);
        this.initializeArticles(initialData);
        console.log('DB initialization completed');
    }

    initializeCategories(initialData) {
        console.log('Inserting categories...');
        this.context.categoryService.insertMany(initialData.categories);
    }

    initializeProducts(initialData) {
        console.log('Inserting products...');
        this.context.productService.insertMany(initialData.products);
    }

    initializeUsers(initialData) {
        console.log('Inserting users...');
        this.context.userService.insertMany(initialData.users);
    }

    initializeArticles(initialData) {
        console.log('Inserting articles...');
        this.context.articleService.insertMany(initialData.articles);
    }

}

module.exports.DbInitializer = DbInitializer;