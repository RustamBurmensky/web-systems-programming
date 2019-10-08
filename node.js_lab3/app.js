const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fieldValidator = require('./validation/httpValidators');
const service = require('./service/calculationService');

// Екземпляр express-додатку
const app = express();

// Порт, що прослуховується сервером
const port = 80;

// Підключення middleware для обробки статичних ресурсів
app.use(express.static('public'));

// Підключення middleware для парсингу URL-encoded тіл для HTML форм
app.use(express.urlencoded({extended: true}));

// Встановлення Handlebars у якості движку представлень
app.set('view engine', 'hbs');

// Реєстрація директорії з частковими представленнями
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Реєстрація helper-функції для округлення чисел
hbs.registerHelper('roundNumber', function(decimals, number) {
    const numberFormat = new Intl.NumberFormat({
        style: "decimal",
        minimumFractionDigits: decimals
    });
    return numberFormat.format(number);
});

// Маршрутизація
app.get('/about', (req, resp) => resp.render('about.hbs'));
app.get('/lab1', (req, resp) => resp.render('lab1.hbs'));
app.get('/lab2', (req, resp) => resp.render('lab2.hbs'));
app.get('/lab3', (req, resp) => resp.render('lab3.hbs'));
app.get('/lab4', (req, resp) => resp.render('lab4.hbs'));
app.get('/', (req, resp) => resp.render('index.hbs'));

// Обробники POST запитів
app.post('/lab1', (req, resp) => {
    const responseObject = Object.assign({}, req.body);
    const errors = {};
    fieldValidator.validateNumericValues(req, Object.keys(req.body), errors);
    if (Object.entries(errors).length > 0) {
        responseObject.errors = errors;
    } else {
        const x = parseFloat(req.body.variableX);
        const y = parseFloat(req.body.variableY);
        const z = parseFloat(req.body.variableZ);
        const result = service.calculateConditional(x, y, z);
        Object.assign(responseObject, result);
    }
    resp.render('lab1.hbs', responseObject);
});

app.post('/lab2', (req, resp) => {
    const responseObject = Object.assign({}, req.body);
    const variables = Object.keys(req.body).filter(key => key.includes('variableX'));
    const errors = {};
    fieldValidator.validateNumericValues(req, Object.keys(req.body), errors);
    fieldValidator.validatePositiveNumericValues(req, variables, errors);
    fieldValidator.validateDividerNotZero(req, variables, errors);
    if (Object.entries(errors).length > 0) {
        responseObject.errors = errors;
    } else {
        const a = parseFloat(req.body.coefficientA);
        const b = parseFloat(req.body.coefficientB);
        const values = [];
        const ELEMENTS_COUNT = 5;
        for (let i = 1; i <= ELEMENTS_COUNT; i++) {
            values.push(parseFloat(req.body['variableX' + i]));
        }
        responseObject.result = service.calculateForLoop(a, b, values);
    }
    resp.render('lab2.hbs', responseObject);
});

app.post('/lab3', (req, resp) => {
    const responseObject = Object.assign({}, req.body);
    const errors = {};
    fieldValidator.validateNumericValues(req, Object.keys(req.body), errors);
    fieldValidator.validatePositiveNumericValues(req, ['rangeStart', 'rangeEnd', 'step'], errors);
    fieldValidator.validateRange(req, errors);
    fieldValidator.validateNoDivisionByZeroInRange(req, errors);
    if (Object.entries(errors).length > 0) {
        responseObject.errors = errors;
    } else {
        const a = parseFloat(req.body.coefficientA);
        const b = parseFloat(req.body.coefficientB);
        const begin = parseFloat(req.body.rangeStart);
        const end = parseFloat(req.body.rangeEnd);
        const step = parseFloat(req.body.step);
        responseObject.result = service.calculateWhileLoop(a, b, begin, end, step);
    }
    resp.render('lab3.hbs', responseObject);
});

app.post('/lab4', (req, resp) => {
    const responseObject = Object.assign({}, req.body);
    const errors = {};
    fieldValidator.validateNumericValues(req, Object.keys(req.body), errors);
    fieldValidator.validatePositiveNumericValues(req, ['rangeStart', 'rangeEnd', 'step'], errors);
    fieldValidator.validateRange(req, errors);
    fieldValidator.validateNoDivisionByZeroInRange(req, errors);
    if (Object.entries(errors).length > 0) {
        responseObject.errors = errors;
    } else {
        const a = parseFloat(req.body.coefficientA);
        const b = parseFloat(req.body.coefficientB);
        const begin = parseFloat(req.body.rangeStart);
        const end = parseFloat(req.body.rangeEnd);
        const step = parseFloat(req.body.step);
        responseObject.result = service.calculateDoWhileLoop(a, b, begin, end, step);
    }
    resp.render('lab4.hbs', responseObject);
});

// Підключення middleware для обробки помилки 404
app.use((req, resp, next) => resp.status(404).render('404.hbs'));

// Підключення middleware для обробки помилок на стороні сервера
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('500 - Internal Server Error');
});

app.listen(port);

console.log('Node.js server listening on port', port);