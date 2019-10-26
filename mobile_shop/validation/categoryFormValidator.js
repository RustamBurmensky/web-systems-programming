/*
    Модуль валідації полів HTML-форми для категорій categoryFormValidator.js
*/
const {check} = require('express-validator');
const categoryService = require('../context/appContext').categoryService;

const fieldValidators = [
    check('categoryId')
        .not().isEmpty().withMessage('Вкажіть ID категорії')
        .isLength({max: 20}).withMessage('Максимальна довжина імені складає 20 символів'),
    check('name')
        .not().isEmpty().withMessage('Вкажіть назву категорії')
        .isLength({max: 50}).withMessage('Максимальна довжина назви категорії складає 50 символів')
];

const uniqueCategoryIdValidator = check('categoryId')
    .custom(categoryId => {
        return categoryService.findById(categoryId).then(category => {
            if (category) {
                return Promise.reject()
            }
        })
    }).withMessage('Вже існує категорія з таким ID');

const categoryUpdateUniqueCategoryIdValidator = check('categoryId')
    .custom((categoryId, {req}) => {
        return categoryService.findById(categoryId).then(category => {
            if (category && category._id != req.body.id) {
                return Promise.reject()
            }
        })
    }).withMessage('Вже існує категорія з таким ID');

module.exports.createCategoryFieldValidators = [
    ...fieldValidators,
    uniqueCategoryIdValidator
];

module.exports.updateCategoryFieldValidators = [
    ...fieldValidators,
    categoryUpdateUniqueCategoryIdValidator
];