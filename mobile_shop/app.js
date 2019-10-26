const express = require('express');
const path = require('path');
const hbs = require('hbs');
const dateFormat = require('dateformat');
const Cart = require('./model/cart').Cart;
const orderStatus = require('./enum/orderStatus');
const dbManager = require('./db/dbManager');
const vhost = require('vhost');
const config = require('./config');

// Екземпляр express-додатку
const app = express();

dbManager.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        app.use(vhost('blog.mobilex.com', require('./blogApp').app))
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

// Реєстрація helper-функцій Handlebars
hbs.registerHelper('getOrderStatusLabel', (item) => {
    return orderStatus[item].label;
});

hbs.registerHelper('ifEquals', (first, second, options) => {
    return (first === second) ?
        options.fn(this) : options.inverse(this);
});

hbs.registerHelper('formatDate', function(date, format) {
    return dateFormat(date, format);
});

hbs.registerHelper('getCartTotalCount', (cartContent) => {
    const cart = new Cart(cartContent);
    return cart.getTotalCount();
});

hbs.registerHelper('getTotalCartPrice', (cartContent) => {
    const cart = new Cart(cartContent);
    return cart.getTotalCartPrice();
});

hbs.registerHelper('getOrderStatusLabel', (item) => {
    return orderStatus[item].label;
});