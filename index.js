const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
let arr;

const articl = require('./articles.js');

const handlers = {
    '/api/articles/readall' : articl.readAll
};

const server = http.createServer((req, res) => {

    fs.readFile("articles.json", (err, data)=>{

        arr = JSON.parse(data);
        parseBodyJson(req, (err, payload) => {
            const handler = getHandler(req.url);

            handler(arr, req, res, payload, (err, result) => {
                if (err) {
                    res.statusCode = err.code;
                    res.setHeader('Content-Type', 'application/json');
                    res.end( JSON.stringify(err) );

                    return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end( JSON.stringify(result) );
            });
        });
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
    return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
    cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
    let body = [];

    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();// Объединяем все блоки даннных в один, затем конвертируем результат в строку и сохраняем в переменную body

        let params = JSON.parse(body);

        cb(null, params);
    });
}