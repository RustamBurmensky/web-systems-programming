/*
    Модуль сервісного шару для роботи з товаром
*/
class ProductService {

    constructor(productDAO) {
        this.productDAO = productDAO;
    }

    findAll(productFilter) {
        return this.productDAO.findAll(productFilter);
    }

    findById(id) {
        return this.productDAO.findById(id);
    }

    insert(product) {
        this.productDAO.insert(product);
    }

    insertMany(products) {
        this.productDAO.insertMany(products);
    }

    update(product) {
        this.productDAO.update(product);
    }

    delete(id) {
        this.productDAO.delete(id);
    }

}

module.exports.ProductService = ProductService;