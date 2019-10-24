const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const {productService, categoryService, userService,
    orderService, loginProvider} = require('./context/appContext');
const hbs = require('hbs');
const Cart = require('./model/cart').Cart;
const ProductFilter = require('./filter/productFilter').ProductFilter;
const {validationResult} = require('express-validator');
const userFormValidator = require('./validation/userFormValidator');
const orderFormValidator = require('./validation/orderFormValidator');
const orderStatus = require('./enum/orderStatus');

// Екземпляр express-додатку
const app = express();

// middleware для обробки статичних ресурсів
app.use(express.static('public'));
app.use(express.static('uploads'));

// middleware для парсингу URL-encoded тіл для HTML форм
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({resave: false, saveUninitialized: false, secret: 'secret'}));

// middleware для включення змінних сесії користувача до відповіді
app.use((req, resp, next) => {
    resp.locals.session = req.session;
    next();
});

app.use((req, resp, next) => {
    if (!req.session.cartContent) {
        req.session.cartContent = [];
    }
    next();
});

// Маршрутизація
app.get('/about', (req, resp) => resp.render('about.hbs'));

app.get('/products/:id', (req, resp) => {
    const productId = req.params.id;
    const productPromise = productService.findById(productId);
    productPromise.then(product => {
        resp.render('products/productDetails.hbs', { 'product': product });
    });
});

app.get(['/', '/products'], (req, resp) => {
    const category = req.query.category;
    const productFilter = new ProductFilter(category);
    const productsPromise = productService.findAll(productFilter);
    const categoriesPromise = categoryService.findAll();
    productsPromise.then(products => {
        categoriesPromise.then(categories => {
            resp.render('products/productList.hbs', { 'products': products, 'categories': categories });
        });
    });
});

app.get('/cart', (req, resp) => {
    resp.render('cart/showCart.hbs');
});

app.get('/order/new', (req, resp) => {
    if (!req.session.user) {
        resp.redirect('/login');
    } else {
        const {firstName, lastName, address, phone} = req.session.user;
        const order = {'firstName': firstName, 'lastName': lastName,
                    'address': address, 'phone': phone};
        resp.render('orders/placeOrder.hbs', {'order': order});
    }
});

app.get('/account', (req, resp) => {
    if (!req.session.user) {
        resp.redirect('/login');
    } else {
        resp.render('account/showAccount.hbs');
    }
});

app.get('/account/update', (req, resp) => {
    if (!req.session.user) {
        resp.redirect('/login');
    } else {
        resp.render('account/updateAccount.hbs');
    }
});

app.get('/account/orders', (req, resp) => {
    if (!req.session.user) {
        resp.redirect('/login');
    } else {
        orderService.findAllByUserId(req.session.user._id).then(orders => {
            resp.render('orders/showOrderHistory.hbs',
                {'orders': orders, 'orderStatus': orderStatus});
        });
    }
});

app.get('/login', (req, resp) => {
    resp.render('login/login.hbs');
});

app.get('/registration', (req, resp) => {
    resp.render('registration/register.hbs');
});

app.post('/cart/add', (req, resp) => {
    const productId = req.body.productId;
    const productPromise = productService.findById(productId);
    productPromise.then(product => {
        const cart = new Cart(req.session.cartContent);
        cart.addOne(product);
        const totalCount = cart.getTotalCount();
        resp.send({'totalCount': totalCount});
    });
});

app.post('/cart/addItem', (req, resp) => {
    const productId = req.body.productId;
    const productPromise = productService.findById(productId);
    productPromise.then(product => {
        const cart = new Cart(req.session.cartContent);
        cart.addOne(product);
        resp.render('cart/showCart.hbs');
    });
});

app.post('/cart/removeItem', (req, resp) => {
    const productId = req.body.productId;
    const productPromise = productService.findById(productId);
    productPromise.then(product => {
        const cart = new Cart(req.session.cartContent);
        cart.removeOne(product);
        resp.render('cart/showCart.hbs');
    });
});

app.post('/cart/removeItemRow', (req, resp) => {
    const productId = req.body.productId;
    const productPromise = productService.findById(productId);
    productPromise.then(product => {
        const cart = new Cart(req.session.cartContent);
        cart.delete(product);
        resp.render('cart/showCart.hbs');
    });
});

app.post('/order/place',
    orderFormValidator.fieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {firstName, lastName, address, phone} = req.body;
    const order = {'firstName': firstName, 'lastName': lastName,
        'address': address, 'phone': phone};
    if (!errors.isEmpty()) {
        resp.render('orders/placeOrder.hbs', {'order': order, 'errors': errors.mapped()});
    } else {
        order.userId = req.session.user._id;
        order.items = req.session.cartContent;
        orderService.insert(order);
        req.session.cartContent = [];
        resp.redirect('/account/orders');
    }
});

app.post('/account/update',
    userFormValidator.updateAccountFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {firstName, lastName, birthday, address, phone, email, password} = req.body;
    const user = {'firstName': firstName, 'lastName': lastName,
        'birthday': birthday, 'address': address, 'phone': phone,
        'email': email, 'password': password};
    if (!errors.isEmpty()) {
        resp.render('account/updateAccount.hbs', {'user': user, 'errors': errors.mapped()});
    } else {
        user._id = req.session.user._id,
        req.session.user = user;
        userService.update(user);
        resp.redirect('/account');
    }
});

app.post('/registration',
    userFormValidator.registrationFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {firstName, lastName, birthday, address, phone, email, password} = req.body;
    const user = {'firstName': firstName, 'lastName': lastName,
        'birthday': birthday, 'address': address, 'phone': phone,
        'email': email, 'password': password};
    if (!errors.isEmpty()) {
        resp.render('registration/register.hbs', {'user': user, 'errors': errors.mapped()});
    } else {
        userService.insert(user);
        resp.redirect('/login');
    }
});

app.post('/login', (req, resp) => {
    const {email, password} = req.body;
    loginProvider.authorize(email, password, (isLoginSuccessful) => {
        if (!isLoginSuccessful) {
            resp.render('login/login.hbs', {error: 'Невірний логін чи пароль'});
        } else {
            userService.findByEmail(email).then(user => {
                req.session.user = user;
                resp.redirect('/');
            });
        }
    });
});

app.post('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/');
});

// Підключення middleware для обробки помилки 404
app.use((req, resp, next) => resp.status(404).render('404.hbs'));

// Підключення middleware для обробки помилок на стороні сервера
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 - Internal Server Error');
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

module.exports.app = app;