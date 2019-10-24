/*
    Модуль сервісного шару для роботи зі статтями
*/
class UserService {

    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    findAll() {
        return this.userDAO.findAll();
    }

    findById(id) {
        return this.userDAO.findById(id);
    }

    findByEmail(email) {
        return this.userDAO.findByEmail(email);
    }

    insert(user) {
        user.birthday = new Date(user.birthday);
        this.userDAO.insert(user);
    }

    insertMany(users) {
        users.forEach(user => user.birthday = new Date(user.birthday));
        this.userDAO.insertMany(users);
    }

    update(user) {
        user.birthday = new Date(user.birthday);
        this.userDAO.update(user);
    }

    delete(id) {
        this.userDAO.delete(id);
    }

}

module.exports.UserService = UserService;