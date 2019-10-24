/*
    Модуль сервісного шару для роботи з товаром
*/
class CategoryService {

    constructor(categoryDAO) {
        this.categoryDAO = categoryDAO;
    }

    findAll() {
        return this.categoryDAO.findAll();
    }

    findById(categoryId) {
        return this.categoryDAO.findById(categoryId);
    }

    insert(category) {
        this.categoryDAO.insert(category);
    }

    insertMany(categories) {
        this.categoryDAO.insertMany(categories);
    }

    update(category) {
        this.categoryDAO.update(category);
    }

    delete(categoryId) {
        this.categoryDAO.delete(categoryId);
    }

}

module.exports.CategoryService = CategoryService;