/*
    Модуль авторизації користувача
*/
class LoginProvider {

    constructor(userService) {
        this.userService = userService;
    }

    authorize(email, password, callback) {
        this.userService.findByEmail(email).then(user => {
            callback(user.password === password);
        });
    }

}

module.exports.LoginProvider = LoginProvider;