const express = require('express');
const path = require('path');
const hbs = require('hbs');
const dateFormat = require('dateformat');
const dbManager = require('./db/dbManager');
const vhost = require('vhost');
const config = require('./config');

// Екземпляр express-додатку
const app = express();

dbManager.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        express().use(vhost('blog.mobilex.com', require('./blogApp').app))
            .use(vhost('admin.mobilex.com', require('./adminApp').app))
            .use(vhost('mobilex.com', require('./shopApp').app)).listen(config.port, () => {
            console.log('Node.js server listen on port', config.port);
        });
    }
});

// Встановлення Handlebars у якості движку представлень
app.set('view engine', 'hbs');

// Реєстрація директорії з частковими представленнями
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Реєстрація helper-функції для форматування дат
hbs.registerHelper('formatDate', function(date, format) {
    return dateFormat(date, format);
});