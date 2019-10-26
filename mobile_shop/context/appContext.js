const dbManager = require('../db/dbManager');
const DbInitializer = require('../db/dbInitializer').DbInitializer;
const ArticleDAO = require('../dao/articleDAO').ArticleDAO;
const ArticleService = require('../service/articleService').ArticleService;
const CategoryDao = require('../dao/categoryDAO').CategoryDAO;
const CategoryService = require('../service/categoryService').CategoryService;
const ProductDao = require('../dao/productDAO').ProductDAO;
const ProductService = require('../service/productService').ProductService;
const UserDao = require('../dao/userDAO').UserDAO;
const UserService = require('../service/userService').UserService;
const OrderDao = require('../dao/orderDAO').OrderDAO;
const OrderService = require('../service/orderService').OrderService;
const LoginProvider = require('../auth/loginProvider').LoginProvider;

const articleDao = new ArticleDAO(dbManager.getDb());
const articleService = new ArticleService(articleDao);
const categoryDAO = new CategoryDao(dbManager.getDb());
const categoryService = new CategoryService(categoryDAO);
const productDao = new ProductDao(dbManager.getDb());
const productService = new ProductService(productDao);
const userDao = new UserDao(dbManager.getDb());
const userService = new UserService(userDao);
const orderDao = new OrderDao(dbManager.getDb());
const orderService = new OrderService(orderDao);

const loginProvider = new LoginProvider(userService);

const context = {
    articleService,
    categoryService,
    productService,
    userService,
    orderService,
    loginProvider
}

const dbInitializer = new DbInitializer(dbManager, context);
dbInitializer.initializeIfNeeded();

module.exports = context;