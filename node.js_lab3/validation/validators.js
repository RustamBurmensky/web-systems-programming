/*
    Модуль валідації даних validators.js
*/
module.exports = {

    /*
        Перевіряє, чи є значення числом.
        Параметри:
        value - значення для перевірки,
        name - назва змінної для повідомлення валідації,
        errors - словник помилок
    */
    isNumeric(value, name, errors) {
        if (isNaN(value)) {
            errors[name] = 'Значення повинне бути числом';
        }
    },
    /*
        Перевіряє, чи є значення додатним числом.
        Параметри:
        value - значення для перевірки,
        name - назва змінної для повідомлення валідації,
        errors - словник помилок
    */
    isPositiveNumber(value, name, errors) {
        let number = parseFloat(value);
        if (number <= 0) {
            errors[name] = 'Значення повинне бути додатнім числом';
        }
    },
    /*
        Перевіряє, чи значення меж діапазону є правильними.
        Параметри:
        start - значення початку діапазону,
        end - значення кінця діапазону,
        name - назва змінної для повідомлення валідації,
        errors - словник помилок
    */
    isRangeValid(start, end, name, errors) {
        let rangeStart = parseFloat(start);
        let rangeEnd = parseFloat(end);
        if (rangeEnd < rangeStart) {
            errors[name] = 'Значення кінця діапазону повинне бути не меншим за значення його початку';
        }
    },
    /*
        Перевіряє, чи знаменник дробу b + sqrt(x) не є нулем.
        Параметри:
        value - значення аргументу x,
        coef - значення коефіцієнта b,
        name - назва змінної для повідомлення валідації,
        errors - словник помилок
    */
    isDividerNotZero(value, coef, name, errors) {
        let number = parseFloat(value);
        let coeffient = parseFloat(coef);
        let divider = coeffient + Math.sqrt(number);
        if (divider == 0) {
            errors[name] = 'Ділення на нуль: знаменник дрібу дорівнює нулю';
        }
    },
    /*
        Перевіряє, чи не дорівнює знаменник дробу b + sqrt(x) нулю у діапазоні.
        Параметри:
        start - початок діапазону,
        end - кінець діапазону,
        step - крок,
        coef - коефіцієнт b,
        name - назва змінної для повідомлення валідації,
        errors - словник помилок
    */
    isRangeHasNoZeroDivision(start, end, step, coef, name, errors) {
        let rangeStart = parseFloat(start);
        let rangeEnd = parseFloat(end);
        let stepValue = parseFloat(step);
        let coeffient = parseFloat(coef);
        for (let currentValue = rangeStart; currentValue <= rangeEnd; currentValue += stepValue) {
            let divider = coeffient + Math.sqrt(currentValue);
            if (divider == 0) {
                errors[name] = 'Ділення на нуль у межах діапазону: змініть діапазон або крок';
                return;
            }
        }
    }

}