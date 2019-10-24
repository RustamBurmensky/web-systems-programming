/*
    Модуль шару DAO (Data Access Object) для роботи з користувачами
*/
const ObjectID = require('mongodb').ObjectID;

class UserDAO {

    constructor(db) {
        this.collection = db.collection('users');
    }

    findAll() {
        return this.collection.find().sort({firstName: 1, lastName: 1}).toArray();
    }

    findById(id) {
        const objectId = new ObjectID(id);
        return this.collection.findOne({_id: objectId});
    }

    findByEmail(email) {
        return this.collection.findOne({'email': email});
    }

    insert(user) {
        this.findByEmail(user.email).then(userEntry => {
            if (userEntry) {
                throw new Error('User with email ' + user.email + ' already exists');
            }
            this.collection.insertOne(user);
        });
    }

    insertMany(users) {
        this.collection.insertMany(users);
    }

    update(user) {
        const objectId = new ObjectID(user._id);
        this.collection.updateOne(
            {_id: objectId},
            {
                $set: {
                    'firstName': user.firstName, 'lastName': user.lastName,
                    'birthday': user.birthday, 'address': user.address,
                    'phone': user.phone, 'email': user.email,
                    'password': user.password
                }
            }
        );
    }

    delete(id) {
        const objectId = new ObjectID(id);
        this.collection.deleteOne({_id: objectId});
    }

}

module.exports.UserDAO = UserDAO;