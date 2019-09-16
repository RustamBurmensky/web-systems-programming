const express = require('express');
const path = require('path');

// Екземпляр express-додатку
const app = express();

// Порт, що прослуховується сервером
const port = 80;

// Підключення middleware для обробки статичних ресурсів
app.use(express.static('public'));

// Маршрутизація
app.get('/about', (req, resp) => resp.sendFile(path.join(__dirname, 'about.html')));
app.get('/lab1', (req, resp) => resp.sendFile(path.join(__dirname, 'lab1.html')));
app.get('/lab2', (req, resp) => resp.sendFile(path.join(__dirname, 'lab2.html')));
app.get('/lab3', (req, resp) => resp.sendFile(path.join(__dirname, 'lab3.html')));
app.get('/lab4', (req, resp) => resp.sendFile(path.join(__dirname, 'lab4.html')));
app.get('/', (req, resp) => resp.sendFile(path.join(__dirname, 'index.html')));

// Підключення middleware для обробки помилки 404
app.use((req, resp, next) => resp.status(404).sendFile(path.join(__dirname, '404.html')));

// Підключення middleware для обробки помилок на стороні сервера
app.use((err, req, res, next) => res.status(500).send('500 - Internal Server Error'));

app.listen(port);

console.log('Node.js server listening on port', port);