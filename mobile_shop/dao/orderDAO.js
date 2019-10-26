/*
    Модуль шару DAO (Data Access Object) для роботи з замовленнями
*/
const ObjectID = require('mongodb').ObjectID;

class OrderDAO {

    constructor(db) {
        this.collection = db.collection('orders');
    }

    findAll() {
        return this.collection.find().sort({date: -1}).toArray();
    }

    findAllByUserId(userId) {
        return this.collection.find({'userId': userId}).sort({date: -1}).toArray();
    }

    findById(id) {
        const objectId = new ObjectID(id);
        return this.collection.findOne({_id: objectId});
    }

    insert(order) {
        this.collection.insertOne(order);
    }

    insertMany(orders) {
        this.collection.insertMany(orders);
    }

    update(order) {
        const objectId = new ObjectID(order._id);
        this.collection.updateOne(
            {_id: objectId},
            {
                $set: {
                    'firstName': order.firstName, 'lastName': order.lastName,
                    'address': order.address, 'phone': order.phone,
                    'status': order.status
                }
            }
        );
    }

    delete(id) {
        const objectId = new ObjectID(id);
        this.collection.deleteOne({_id: objectId});
    }

}

module.exports.OrderDAO = OrderDAO;