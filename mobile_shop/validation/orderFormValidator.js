/*
    Модуль валідації полів HTML-форми для замовлення orderFormValidator.js
*/
const {check} = require('express-validator');

module.exports.fieldValidators = [
    check('firstName')
        .not().isEmpty().withMessage('Вкажіть ім\'я отримувача')
        .isLength({max: 30}).withMessage('Максимальна довжина імені складає 30 символів'),
    check('lastName')
        .not().isEmpty().withMessage('Вкажіть прізвище отримувача')
        .isLength({max: 30}).withMessage('Максимальна довжина прізвища складає 30 символів'),
    check('address')
        .not().isEmpty().withMessage('Вкажіть адресу доставки')
        .isLength({max: 100}).withMessage('Максимальна довжина адреси складає 100 символів'),
    check('phone')
        .not().isEmpty().withMessage('Вкажіть контактний телефон')
        .isMobilePhone('uk-UA').withMessage('Вкажіть валідний номер мобільного телефону')
];