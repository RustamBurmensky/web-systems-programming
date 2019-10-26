/*
    Модуль валідації полів HTML-форми для товару productFormValidator.js
*/
const {check} = require('express-validator');
const {categoryService} = require('../context/appContext');

module.exports.fieldValidators = [
    check('name')
        .not().isEmpty().withMessage('Заповніть назву товару')
        .isLength({max: 100}).withMessage('Максимальна довжина назви товару складає 100 символів'),
    check('description')
        .not().isEmpty().withMessage('Заповніть опис товару')
        .isLength({max: 1000}).withMessage('Максимальна довжина опису товару складає 1000 символів'),
    check('price')
        .not().isEmpty().withMessage('Заповність ціну товару')
        .isNumeric().withMessage('Ціна повинна бути числом')
        .isFloat({gt: 0, lt: 1000000}).withMessage('Ціна повинна бути більше за 0 грн та менше за 1.000.000 грн'),
    check('manufacturer')
        .not().isEmpty().withMessage('Вкажіть виробника товару')
        .isLength({max: 50}).withMessage('Максимальна довжина виробника товару складає 50 символів'),
    check('categoryId')
        .not().isEmpty().withMessage('Вкажіть категорію товару')
        .custom((categoryId) => {
            categoryService.findById(categoryId).then(category => {
                if (!category) {
                    return Promise.reject();
                }
            });
        }).withMessage('Вказано невірну категорію')
];