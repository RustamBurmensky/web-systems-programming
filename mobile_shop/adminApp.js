const path = require('path');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const {articleService, productService, categoryService, userService,
    orderService, loginProvider} = require('./context/appContext');
const hbs = require('hbs');
const ProductFilter = require('./filter/productFilter').ProductFilter;
const {validationResult} = require('express-validator');
const categoryFormValidator = require('./validation/categoryFormValidator');
const productFormValidator = require('./validation/productFormValidator');
const articleFormValidator = require('./validation/articleFormValidator');
const userFormValidator = require('./validation/userFormValidator');
const orderFormValidator = require('./validation/orderFormValidator');
const orderStatus = require('./enum/orderStatus');

// Екземпляр express-додатку
const app = express();

// middleware для обробки статичних ресурсів
app.use(express.static('public'));
app.use(express.static('uploads'));

// Налаштування multer
const mediaStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/product-img');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(new Error('Only .jpeg or .png files are accepted'), false);   
    }
};

const upload = multer({storage: mediaStorage, fileFilter: fileFilter});

// middleware для парсингу URL-encoded тіл для HTML форм
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({resave: false, saveUninitialized: false, secret: 'secret'}));

// middleware для включення змінних сесії користувача до відповіді
app.use((req, resp, next) => {
    resp.locals.session = req.session;
    next();
});

// middleware для перенаправлення на авторизацію неавторизованого користувача
app.use((req, resp, next) => {
    if (req.url != '/login' && !req.session.user) {
        resp.redirect('/login');
    } else {
        next();
    }
});

app.get('/', (req, resp) => {
    resp.render('admin/index.hbs');
});

app.get('/login', (req, resp) => {
    resp.render('admin/login.hbs');
});

app.get('/categories', (req, resp) => {
    categoryService.findAll().then(categories => {
        resp.render('admin/categories/showCategories.hbs',
            {'categories': categories});
    });
});

app.get('/categories/create', (req, resp) => {
    resp.render('admin/categories/createCategory.hbs');
});

app.get('/categories/update/:categoryId', (req, resp) => {
    const categoryId = req.params.categoryId;
    categoryService.findById(categoryId).then(category => {
        resp.render('admin/categories/updateCategory.hbs', {'category': category});
    });
});

app.get('/products', (req, resp) => {
    productService.findAll(new ProductFilter()).then(products => {
        resp.render('admin/products/showProducts.hbs',
            {'products': products});
    });
});

app.get('/products/create', (req, resp) => {
    categoryService.findAll().then(categories => {
        resp.render('admin/products/createProduct.hbs',
            {'categories': categories});
    });
});

app.get('/products/update/:productId', (req, resp) => {
    const productId = req.params.productId;
    productService.findById(productId).then(product => {
        categoryService.findAll().then(categories => {
            resp.render('admin/products/updateProduct.hbs',
                {'product': product, 'categories': categories});
        });
    });
});

app.get('/users', (req, resp) => {
    userService.findAll().then(users => {
        resp.render('admin/users/showUsers.hbs', {'users': users});
    });
});

app.get('/users/create', (req, resp) => {
    resp.render('admin/users/createUser.hbs');
});

app.get('/users/update/:userId', (req, resp) => {
    const userId = req.params.userId;
    userService.findById(userId).then(user => {
        resp.render('admin/users/updateUser.hbs', {'user': user});
    });
});

app.get('/orders', (req, resp) => {
    orderService.findAll().then(orders => {
        resp.render('admin/orders/showOrders.hbs', {'orders': orders});
    });
});

app.get('/orders/update/:orderId', (req, resp) => {
    const orderId = req.params.orderId;
    orderService.findById(orderId).then(order => {
        resp.render('admin/orders/updateOrder.hbs', {'order': order, 'statuses': orderStatus});
    });
});

app.get('/articles', (req, resp) => {
    articleService.findAll().then(articles => {
        resp.render('admin/articles/showArticles.hbs', {'articles': articles});
    });
});

app.get('/articles/create', (req, resp) => {
    resp.render('admin/articles/createArticle.hbs');
});

app.get('/articles/update/:id', (req, resp) => {
    const articleId = req.params.id;
    const articlePromise = articleService.findById(articleId);
    articlePromise.then(article => {
        resp.render('admin/articles/updateArticle.hbs', { 'article': article });
    });
});

app.post('/categories/create',
    categoryFormValidator.createCategoryFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {categoryId, name} = req.body;
    const category = {'categoryId': categoryId, 'name': name};
    if (!errors.isEmpty()) {
        resp.render('admin/categories/createCategory.hbs',
            {'category': category, 'errors': errors.mapped()});
    } else {
        categoryService.insert(category);
        resp.redirect('/categories');
    }
});

app.post('/categories/update',
    categoryFormValidator.updateCategoryFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {categoryId, name} = req.body;
    const category = {'categoryId': categoryId, 'name': name};
    if (!errors.isEmpty()) {
        resp.render('admin/categories/updateCategory.hbs',
            {'category': category, 'errors': errors.mapped()});
    } else {
        categoryService.update(category);
        resp.redirect('/categories');
    }
});

app.post('/categories/delete', (req, resp) => {
    const categoryId = req.body.id;
    const productFilter = new ProductFilter(categoryId);
    productService.findAll(productFilter).then(products => {
        if (products.length == 0) {
            categoryService.delete(categoryId);
        }
    });
    resp.redirect('/categories');
});

app.post('/products/create',
    productFormValidator.fieldValidators,
    upload.single('image'), (req, resp) => {
    const errors = validationResult(req.body);
    const {name, description, price, manufacturer, categoryId} = req.body;
    const product = {'name': name, 'description': description,
        'price': parseFloat(price), 'manufacturer': manufacturer, 'categoryId': categoryId};
    if (req.file) {
        product.image = req.file.filename;
    }
    if (!errors.isEmpty()) {
        resp.render('admin/products/createProduct.hbs',
            {'product': product, 'errors': errors.mapped()});
    } else {
        productService.insert(product);
        resp.redirect('/products');
    }
});

app.post('/products/update',
    productFormValidator.fieldValidators,
    upload.single('image'), (req, resp) => {
    const errors = validationResult(req.body);
    const {id, name, description, price, manufacturer, categoryId} = req.body;
    const product = {'_id': id, 'name': name, 'description': description,
        'price': parseFloat(price), 'manufacturer': manufacturer, 'categoryId': categoryId};
    if (req.file) {
        product.image = req.file.filename;
    }
    if (!errors.isEmpty()) {
        resp.render('admin/products/createProduct.hbs',
            {'product': product, 'errors': errors.mapped()});
    } else {
        productService.update(product);
        resp.redirect('/products');
    }
});

app.post('/products/delete', (req, resp) => {
    const productId = req.body.id;
    productService.delete(productId);
    resp.redirect('/products');
});

app.post('/users/create',
    userFormValidator.registrationFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {firstName, lastName, birthday, address, phone, email, password} = req.body;
    const user = {'firstName': firstName, 'lastName': lastName,
        'birthday': birthday, 'address': address, 'phone': phone,
        'email': email, 'password': password};
    if (!errors.isEmpty()) {
        resp.render('admin/users/createUser.hbs', {'user': user, 'errors': errors.mapped()});
    } else {
        userService.insert(user);
        resp.redirect('/users');
    }
});

app.post('/users/update',
    userFormValidator.updateUserFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {id, firstName, lastName, birthday, address, phone, email, password} = req.body;
    const user = {'_id': id, 'firstName': firstName, 'lastName': lastName,
        'birthday': birthday, 'address': address, 'phone': phone,
        'email': email, 'password': password};
    if (!errors.isEmpty()) {
        resp.render('admin/users/updateUser.hbs', {'user': user, 'errors': errors.mapped()});
    } else {
        userService.update(user);
        resp.redirect('/users');
    }
});

app.post('/orders/update',
    orderFormValidator.updateOrderFieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {id, firstName, lastName, address, phone, status} = req.body;
    const order = {'_id': id, 'firstName': firstName, 'lastName': lastName,
        'address': address, 'phone': phone, 'status': status};
    if (!errors.isEmpty()) {
        orderService.findById(id).then(originalOrder => {
            order.items = originalOrder.items;
            resp.render('admin/orders/updateOrder.hbs',
                {'order': order, 'statuses': orderStatus, 'errors': errors.mapped()});
        });
    } else {
        orderService.update(order);
        resp.redirect('/orders');
    }
});

app.post('/users/delete', (req, resp) => {
    const userId = req.body.id;
    userService.delete(userId);
    resp.redirect('/users');
});


app.post('/orders/delete', (req, resp) => {
    const orderId = req.body.id;
    orderService.delete(orderId);
    resp.redirect('/orders');
});

app.post('/articles/create',
    articleFormValidator.fieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {title, description, text, author} = req.body;
    const article = {'title': title, 'description': description,
        'text': text, 'author': author};
    if (!errors.isEmpty()) {
        resp.render('admin/articles/createArticle.hbs',
            {'article': article, 'errors': errors.mapped()});
    } else {
        articleService.insert(article);
        resp.redirect('/articles');
    }
});

app.post('/articles/update',
    articleFormValidator.fieldValidators, (req, resp) => {
    const errors = validationResult(req);
    const {id, title, description, text, author} = req.body;
    const article = {'_id': id, 'title': title, 'description': description,
        'text': text, 'author': author};
    if (!errors.isEmpty()) {
        resp.render('admin/articles/updateArticle.hbs',
            {'article': article, 'errors': errors.mapped()});
    } else {
        articleService.update(article);
        resp.redirect('/articles');
    }
});

app.post('/articles/delete', (req, resp) => {
    const articleId = req.body.id;
    articleService.delete(articleId);
    resp.redirect('/articles');
});

app.post('/login', (req, resp) => {
    const {login, password} = req.body;
    if (!loginProvider.authorizeAdmin(login, password)) {
        resp.render('admin/login.hbs', {error: 'Невірний логін чи пароль'});
    } else {
        req.session.user = {'login': login, 'password': password};
        resp.redirect('/');
    }
});

app.post('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login');
});

// Підключення middleware для обробки помилки 404
app.use((req, resp, next) => resp.status(404).render('404.hbs'));

// Підключення middleware для обробки помилок на стороні сервера
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500 - Internal Server Error');
});

// Реєстрація helper-функцій Handlebars
hbs.registerHelper('getOrderStatusLabel', (item) => {
    return orderStatus[item].label;
});

hbs.registerHelper('ifEquals', (first, second, options) => {
    return (first === second) ?
        options.fn(this) : options.inverse(this);
});

module.exports.app = app;