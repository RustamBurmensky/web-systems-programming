/*
    Модуль сервісного шару для роботи зі статтями
*/
class ArticleService {

    constructor(articleDAO) {
        this.articleDAO = articleDAO;
    }

    findAll() {
        return this.articleDAO.findAll();
    }

    findById(id) {
        return this.articleDAO.findById(id);
    }

    insert(article) {
        article.date = new Date();
        this.articleDAO.insert(article);
    }

    insertMany(articles) {
        articles.forEach(article => article.date = new Date());
        this.articleDAO.insertMany(articles);
    }

    update(article) {
        this.articleDAO.update(article);
    }

    delete(id) {
        this.articleDAO.delete(id);
    }

}

module.exports.ArticleService = ArticleService;