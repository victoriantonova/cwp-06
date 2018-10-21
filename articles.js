const fs = require('fs');
let articles = require("./articles.json");

module.exports = {
    readAll
};

function readAll(arr, req, res, payload, cb) {
    let sortField = ['id', 'title', 'text', 'date', 'author'];
    let sortOrder;
    let clonedArr = [...arr];
    let page = 1;
    let pages = 1;
    let limit = 10;

    const sortFieldDefault = "date";
    const sortOrderDefault = "desc";//по убыванию

    if (payload.sortField === undefined) {
        sortField = sortFieldDefault;
    }
    else {
        sortField = payload.sortField;
    }
    if (payload.sortOrder === undefined) {
        sortOrder = sortOrderDefault;
    }
    else {
        sortOrder = payload.sortOrder;
    }

        clonedArr.sort((a, b) =>{
            if (a[sortField] > b[sortField]) {
                return sortOrder === "asc" ? 1 : -1;
            }
            else {
                return sortOrder === "asc" ? -1 : 1;
            }
        });

    if(payload.page !== undefined && payload.limit !== undefined)
    {
        page  = payload.page;
        limit = payload.limit;
        pages = Math.ceil( clonedArr.length / limit);
    }
    clonedArr = clonedArr.splice((pages-1)*limit, limit*page);

    if(payload.includeDeps === false)
    {
        clonedArr = clonedArr.map((element)=>{
            delete element.comment;
            return element;
    });
    }

    let answer = {"items":clonedArr, "meta":{"page": page, "pages": pages, "count": clonedArr.length, "limit":limit}};
    cb(null, answer);
  }