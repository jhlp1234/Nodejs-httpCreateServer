const template = require("../datas/template.js");
const db = require("../datas/db.js");
const qs = require("querystring");

exports.home = function(req, res, queryData){
  db.query("SELECT * FROM topic", function(error, result){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, function(error2, result2){
      if(error2){
        throw error;
      }
      var lists = template.list(result);
      var html = template.html("Author",
        `
        <table>
          ${template.author_list(result2)}
        </table>
        <br><a href="/author/create">Create</a>
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border: 1px solid black;
          }
        </style>
        `, lists,"");
      res.end(html);
    })
  })
}

exports.create = function(req, res){
  db.query("SELECT name FROM author", function(error, result){
    if(error){
      throw error;
    }
    var lists = template.list(result);
  var html = template.html("Create", `<form action="/author/create_process" method="post">
   <p><input type="text" name="name" placeholder="name"></p>
   <p>
     <textarea name="profile" placeholder="profile"></textarea>
   </p>
   <p>
     <input type="submit">
   </p>
 </form>`,
     "", "");
  res.end(html);
  })
}

exports.create_process = function(req, res){
  var body = "";
    req.on("data", function (data) {
      body = body + data;
    })
    req.on("end", function () {
      var post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUES (?, ?)`, [post.name, post.profile], function(error, results){
          if(error){
            throw error;
          }
          res.writeHead(302, { location: "/author" });
          res.end();
        })
    })
}

exports.update = function(req, res, queryData){
  var html = template.html("Update", `<form action="/author/update_process" method="post">
    <p><input type="hidden" name="id" value="${queryData}"></p>
    <p><input type="text" name="name" placeholder="name"></p>
    <p>
      <textarea name="profile" placeholder="profile"></textarea>
    </p>
    <p>
      <input type="submit">
    </p>
  </form>`,
      "", "");
   res.end(html);
}

exports.update_process = function(req, res){
  var body = "";
    req.on("data", function (data) {
      body = body + data;
    })
    req.on("end", function () {
      var post = qs.parse(body);
        console.log(post)
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], function(error, results){
          if(error){
            throw error;
          }
          res.writeHead(302, { location: "/author" });
          res.end();
        })
    })
}

exports.delete_process = function(req, res){
  var body = "";
    req.on("data", function (data) {
      body = body + data;
    })
    req.on("end", function () {
      var post = qs.parse(body);
        db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error, results){
          if(error){
            throw error;
          }
          res.writeHead(302, { location: "/author" });
          res.end();
        })
    })
}