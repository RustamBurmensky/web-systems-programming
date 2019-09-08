const http = require('http');
const fs = require('fs');
const path = require('path');

// Порт, що прослуховується сервером
const port = 80;

// Словник пар [розширення файлу -> MIME-тип та директорія для пошуку] для статичних ресурсів
const staticResources = new Map([
    ['.js',  {contentType: 'text/javascript', directory: '/js/'}],
    ['.css', {contentType: 'text/css', directory: '/css/'}],
    ['.jpg', {contentType: 'image/jpeg', directory: '/img/'}],
    ['.png', {contentType: 'image/png', directory: '/img/'}]
]);

// Словник пар [URL запиту -> функція-обробник]
const mappings = new Map([
    ['/', (resp) => writeFileToResponse('index.html', resp, 'text/html')],
    ['/about', (resp) => writeFileToResponse('about.html', resp, 'text/html')],
    ['/lab1', (resp) => writeFileToResponse('lab1.html', resp, 'text/html')],
    ['/lab2', (resp) => writeFileToResponse('lab2.html', resp, 'text/html')],
    ['/lab3', (resp) => writeFileToResponse('lab3.html', resp, 'text/html')],
    ['/lab4', (resp) => writeFileToResponse('lab4.html', resp, 'text/html')]
]);

http.createServer(function(req, resp) {
    let path = req.url.replace(/\?(?:\?.*)?/, '').toLowerCase();
    if (isResourceStatic(path)) {
        serveStaticResource(path, resp);
    } else {
        let mapping = mappings.get(path);
        if (mapping) {
            mapping(resp);
        } else {
            writeFileToResponse('404.html', resp, 'text/html', 404);
        }
    }
}).listen(port);

/*
    Перевіряє, чи є ресурс статичним
    Параметри:
    path - шлях до ресурсу.
    Повертає:
    true, якщо ресурс є статичним.
*/
function isResourceStatic(path) {
    for (staticResource of staticResources.values()) {
        if (path.toLowerCase().startsWith(staticResource.directory)) {
            return true;
        }
    }
    return false;
}

/*
    Передає запитуваний статичний ресурс до відповіді (response) сервера.
    Якщо запитуваний ресурс не було знайдено, клієнта буде переадресовано на
    строрінку помилки 404.
    Параметри:
    url - URL ресурсу,
    resp - відповідь сервера.
*/
function serveStaticResource(url, resp) {
    let relativePath = path.join('public', url);
    if (fs.existsSync(relativePath)) {
        let extension = path.extname(url);
        let contentType = staticResources.get(extension).contentType;
        writeFileToResponse(relativePath, resp, contentType);
    } else {
        writeFileToResponse('404.html', resp, 'text/html', 404);
    }
}

/*
    Записує до відповіді сервера запитуваний ресурс.
    Якщо запитуваний ресурс не вдалося записати до відповіді, клієнту буде переадресовано на
    строрінку помилки 500.
    Параметри:
    path - шлях до ресурсу,
    resp - відповідь сервера,
    contentType - MIME-тип контенту,
    statusCode - код стану HTTP-запиту у разі успіху.
*/
function writeFileToResponse(path, resp, contentType, statusCode = 200) {
    fs.readFile(path, function(err, data) {
        if (err) {
            resp.writeHead(500, {'Content-Type': 'text/plain'});
            resp.end('500 - Internal Server error');
        } else {
            resp.writeHead(statusCode, {'Content-Type': contentType});
            resp.end(data);
        }
    });
}

console.log('Node.js server listening on port', port);