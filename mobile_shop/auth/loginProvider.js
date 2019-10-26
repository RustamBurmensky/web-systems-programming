/*
    Модуль авторизації користувача
*/
const config = require('../config');

class LoginProvider {

    constructor(userService) {
        this.userService = userService;
    }

    authorize(email, password, callback) {
        this.userService.findByEmail(email).then(user => {
            callback(user.password === password);
        });
    }

    authorizeAdmin(login, password) {
        return login === config.adminPanel.login &&
            password === config.adminPanel.password;
    }

}

module.exports.LoginProvider = LoginProvider;