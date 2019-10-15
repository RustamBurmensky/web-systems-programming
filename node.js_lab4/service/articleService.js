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

}

module.exports.ArticleService = ArticleService;