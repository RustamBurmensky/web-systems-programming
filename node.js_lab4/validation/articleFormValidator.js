/*
    Модуль валідації полів HTML-форми для статті articleFormValidator.js
*/
const {check} = require('express-validator');

module.exports.fieldValidators = [
    check('title')
        .not().isEmpty().withMessage('Заповніть заголовок статті')
        .isLength({max: 50}).withMessage('Максимальна довжина заголовку складає 50 символів'),
    check('description')
        .not().isEmpty().withMessage('Заповніть опис статті')
        .isLength({max: 255}).withMessage('Максимальна довжина опису статті складає 255 символів'),
    check('text')
        .not().isEmpty().withMessage('Заповність текст статті')
        .isLength({max: 1000}).withMessage('Максимальна довжина тексту статті складає 1000 символів'),
    check('author')
        .not().isEmpty().withMessage('Вкажіть автора статті')
        .isLength({max: 50}).withMessage('Максимальна довжина імені автора складає 50 символів')
];