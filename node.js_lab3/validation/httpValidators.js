/*
    Модуль валідації параметрів HTTP запитів клієнта
*/
const validators = require('./validators');

module.exports = {

    /*
        Виконує валідацію списку полів форми вказаним валідатором.
        Параметри:
        req - об'єкт запиту користувача,
        fieldList - список імен полів форми для валідації,
        validator - функція-валідатор,
        errors - словник помилок
    */
    validateFields(req, fieldList, validator, errors) {
        for (let field of fieldList) {
            let fieldValue = req.body[field];
            validator(fieldValue, field, errors);
        }
    },
    /*
        Перевіряє, чи є всі значення полів є числами.
        Параметри:
        req - об'єкт запиту користувача,
        fieldList - список імен полів форми для валідації,
        errors - словник помилок
    */
    validateNumericValues(req, fieldList, errors) {
        this.validateFields(req, fieldList, validators.isNumeric, errors);
    },
    /*
        Перевіряє, чи є всі значення полів є додатними числами.
        Параметри:
        req - об'єкт запиту користувача,
        fieldList - список імен полів форми для валідації,
        errors - словник помилок
    */
    validatePositiveNumericValues(req, fieldList, errors) {
        this.validateFields(req, fieldList, validators.isPositiveNumber, errors);
    },
    /*
        Перевіряє, чи є не призведе один з аргументів до ділення на нуль
        у знаменнику дробу b + sqrt(x).
        Параметри:
        req - об'єкт запиту користувача,
        fieldList - список імен полів форми для валідації,
        errors - словник помилок
    */
    validateDividerNotZero(req, fieldList, errors) {
        let coefficient = req.body.coefficientB;
        for (let field of fieldList) {
            validators.isDividerNotZero(req.body[field], coefficient, field, errors);
        }
    },
    /*
        Перевіряє, чи межі діапазону є правильними.
        Параметри:
        req - об'єкт запиту користувача,
        errors - словник помилок
    */
    validateRange(req, errors) {
        let rangeStart = req.body.rangeStart;
        let rangeEnd = req.body.rangeEnd;
        validators.isRangeValid(rangeStart, rangeEnd, 'rangeEnd', errors);
    },
    /*
        Перевіряє, чи відсутнє ділення на нуль у межах діапазону.
        Параметри:
        req - об'єкт запиту користувача,
        errors - словник помилок
    */
    validateNoDivisionByZeroInRange(req, errors) {
        let rangeStart = req.body.rangeStart;
        let rangeEnd = req.body.rangeEnd;
        let coefficient = req.body.coefficientB;
        let step = req.body.step;
        validators.isRangeHasNoZeroDivision(rangeStart, rangeEnd, step,
            coefficient, 'rangeStart', errors);
    }

}