/*
    Модуль валідації полів HTML-форми для користувача userFormValidator.js
*/
const {check} = require('express-validator');
const userService = require('../context/appContext').userService;

const fieldValidators = [
    check('firstName')
        .not().isEmpty().withMessage('Вкажіть ім\'я')
        .isLength({max: 30}).withMessage('Максимальна довжина імені складає 30 символів'),
    check('lastName')
        .not().isEmpty().withMessage('Вкажіть прізвище')
        .isLength({max: 30}).withMessage('Максимальна довжина прізвища складає 30 символів'),
    check('birthday')
        .not().isEmpty().withMessage('Вкажіть дату народження')
        .isBefore((new Date()).toDateString()).withMessage('День народження не може бути у майбутньому'),
    check('address')
        .not().isEmpty().withMessage('Вкажіть адресу')
        .isLength({max: 100}).withMessage('Максимальна довжина адреси складає 100 символів'),
    check('phone')
        .not().isEmpty().withMessage('Вкажіть телефон')
        .isMobilePhone('uk-UA').withMessage('Вкажіть валідний номер мобільного телефону'),
    check('email')
        .not().isEmpty().withMessage('Вкажіть e-mail')
        .isEmail().withMessage('Вкажіть валідну адресу e-mail'),
    check('password')
        .not().isEmpty().withMessage('Вкажіть пароль')
        .isLength({min: 6, max: 30}).withMessage('Пароль повинен містити від 6 до 30 символів')
];

const uniqueEmailValidator = check('email')
    .custom(email => {
        return userService.findByEmail(email).then(user => {
            if (user) {
                return Promise.reject()
            }
        })
    }).withMessage('Вже існує аккаунт з таким e-mail');

const accountUpdateUniqueEmailValidator = check('email')
    .custom((email, {req}) => {
        return userService.findByEmail(email).then(user => {
            if (user && user._id != req.session.user._id) {
                return Promise.reject()
            }
        })
    }).withMessage('Вже існує аккаунт з таким e-mail');

const userUpdateUniqueEmailValidator = check('email')
    .custom((email, {req}) => {
        return userService.findByEmail(email).then(user => {
            if (user && user._id != req.body.id) {
                return Promise.reject()
            }
        })
    }).withMessage('Вже існує аккаунт з таким e-mail');

module.exports.registrationFieldValidators = [
    ...fieldValidators,
    uniqueEmailValidator
];

module.exports.updateAccountFieldValidators = [
    ...fieldValidators,
    accountUpdateUniqueEmailValidator
];

module.exports.updateUserFieldValidators = [
    ...fieldValidators,
    userUpdateUniqueEmailValidator
];