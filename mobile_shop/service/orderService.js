/*
    Модуль сервісного шару для роботи зі статтями
*/
const orderStatus = require('../enum/orderStatus');

class OrderService {

    constructor(orderDAO) {
        this.orderDAO = orderDAO;
    }

    findAll() {
        return this.orderDAO.findAll();
    }

    findAllByUserId(userId) {
        return this.orderDAO.findAllByUserId(userId);
    }

    findById(id) {
        return this.orderDAO.findById(id);
    }

    insert(order) {
        order.date = new Date();
        order.status = orderStatus.ACCEPTED.value;
        this.orderDAO.insert(order);
    }

    insertMany(orders) {
        orders.forEach(order => {
            order.date = new Date();
            order.status = orderStatus.ACCEPTED.value;
        });
        this.orderDAO.insertMany(orders);
    }

    update(order) {
        this.orderDAO.update(order);
    }

    delete(id) {
        this.orderDAO.delete(id);
    }

}

module.exports.OrderService = OrderService;