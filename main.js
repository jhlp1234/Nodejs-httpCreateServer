const http = require('http');
const url = require("url");
const qs = require("querystring");
const template = require("./datas/template.js");
const db = require("./datas/db.js");
const topic = require("./datas/topic.js");
const author = require("./datas/author.js");

var app = http.createServer(function (req, res) {
  var rqurl = req.url;
  var queryData = url.parse(rqurl, true).query;
  var pathname = url.parse(rqurl, true).pathname;

  if (pathname === "/") {
    if (queryData.id == undefined) {
      topic.home(req, res);
    }
    else {
      topic.query(req, res, queryData);
    }
  }
  else if (pathname === "/create") {
    topic.create(req, res, queryData);
  }
  else if (pathname === "/create_process") {
    topic.create_process(reeq, res, queryData);
  }
  else if (pathname === "/update") {
    topic.update(req, res, queryData);
  }
  else if (pathname === "/update_process") {
    topic.update_process(req, res, queryData);
  }
  else if (pathname === "/delete_process") {
    topic.delete_process(req, res, queryData);
  }
  else if(pathname === "/author"){
    author.home(req, res, queryData.id);
  }
  else if(pathname === "/author/create"){
    author.create(req, res);
  }
  else if(pathname === "/author/create_process"){
    author.create_process(req, res);
  }
  else if(pathname === "/author/update"){
    author.update(req, res, queryData.id);
  }
  else if(pathname === "/author/update_process"){
    author.update_process(req, res);
  }
  else if(pathname === "/author/delete_process"){
    author.delete_process(req, res);
  }
  else {
    res.writeHead(200);
    res.end(`${pathname.substring(1)} Not Found`)
  }
});

app.listen(3000, function () {
  console.log("Start")
});