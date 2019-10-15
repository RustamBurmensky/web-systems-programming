const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const hbs = require('hbs');
const dateFormat = require('dateformat');
const ArticleDAO = require('./dao/articleDAO').ArticleDAO;
const ArticleService = require('./service/articleService').ArticleService;

// Екземпляр express-додатку
const app = express();

// Порт, що прослуховується сервером
const port = 80;

// Екземпляр клієнта MongoDB
const mongoClient = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true});

// Сервіс для роботи зі статтями
var articleService;

// З'єднання з БД та підключення слухача веб-додатку до порту
mongoClient.connect(function(err, connection) {
    if (err) {
        console.error(err);
    } else {
        const articleDAO = new ArticleDAO(connection);
        articleService = new ArticleService(articleDAO);
        app.listen(port, () => {
            console.log('Node.js server listen on port', port);
        });
    }
});

// Підключення middleware для обробки статичних ресурсів
app.use(express.static('public'));

// Підключення middleware для парсингу URL-encoded тіл для HTML форм
app.use(express.urlencoded({extended: true}));

// Встановлення Handlebars у якості движку представлень
app.set('view engine', 'hbs');

// Реєстрація директорії з частковими представленнями
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Реєстрація helper-функції для форматування дат
hbs.registerHelper('formatDate', function(date) {
    return dateFormat(date, 'dd.mm.yyyy HH:mm:ss');
});

// Маршрутизація
app.get('/about', (req, resp) => resp.render('about.hbs'));

app.get('/articles/:id', (req, resp) => {
    const articleId = req.params.id;
    const articlePromise = articleService.findById(articleId);
    articlePromise.then(article => {
        resp.render('articleDetails.hbs', { 'article': article });
    });
});

app.get(['/', '/articles'], (req, resp) => {
    const articlesPromise = articleService.findAll();
    articlesPromise.then(articles => {
        resp.render('index.hbs', { 'articles': articles });
    });
});

// Підключення middleware для обробки помилки 404
app.use((req, resp, next) => resp.status(404).render('404.hbs'));

// Підключення middleware для обробки помилок на стороні сервера
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 - Internal Server Error');
});