const express = require('express');
const appContext = require('./context/appContext');

// Екземпляр express-додатку
const app = express();

// Підключення middleware для обробки статичних ресурсів
app.use(express.static('public'));

// Сервіс для роботи зі статтями
const articleService = appContext.articleService;

app.get('/articles/show/:id', (req, resp) => {
    const articleId = req.params.id;
    const articlePromise = articleService.findById(articleId);
    articlePromise.then(article => {
        resp.render('blog/showArticle.hbs', { 'article': article });
    });
});

app.get(['/', '/articles'], (req, resp) => {
    const articlesPromise = articleService.findAll();
    articlesPromise.then(articles => {
        resp.render('blog/index.hbs', { 'articles': articles });
    });
});

// Підключення middleware для обробки помилки 404
app.use((req, resp, next) => resp.status(404).render('404.hbs'));

// Підключення middleware для обробки помилок на стороні сервера
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 - Internal Server Error');
});

module.exports.app = app;