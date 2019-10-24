/*
    Модуль для початкової ініціалізації бази даних
*/
const fs = require('fs');

class DbInitializer {

    constructor(articleService) {
        this.articleService = articleService;
    }

    initializeIfNeeded() {
        const articlesPromise = this.articleService.findAll();
        articlesPromise.then(articles => {
            if (articles.length == 0) {
                console.log('Initializing DB...');
                const rawIntialData = fs.readFileSync('./public/json/initialData.json');
                const initialData = JSON.parse(rawIntialData);
                this.articleService.insertMany(initialData.articles);
                console.log('DB initialization completed')
            }
        });
    }

}

module.exports.DbInitializer = DbInitializer;