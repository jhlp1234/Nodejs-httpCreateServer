const template = require("../datas/template.js");
const db = require("../datas/db.js");
const sanitizeHtml = require("sanitize-html");
const qs = require("querystring");

exports.home = function(req, res){
  db.query("SELECT * FROM topic", function (error, results) {
    if(error){
      throw error;
    }
    const title = "Welcome";
    const script = "The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.";
    var lists = template.list(results);
    const control = `<a href="/create">Create</a>`;
    var html = template.html(title, script, lists, control)
    res.end(html);
   })
}

exports.query = function(req, res, queryData){
  db.query(`SELECT * FROM topic`, function (error, results) {
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`, [queryData.id], function (error2, results2){
      if(error2){
        throw error2;
      }
      const title = results2[0].title;
      var sanitizeTitle = sanitizeHtml(title);
      const script = results2[0].description;
      var sanitizeScript = sanitizeHtml(script);
      var lists = template.list(results);
      const control = `<a href="/update?id=${queryData.id}">Update</a>
      <br>
       <form action="/delete_process" method="post">
     <input type="hidden" name="id" value="${queryData.id}">
       <input type="submit" value="Delete"></form>
      </form>`;
      var html = template.html(sanitizeTitle, `${sanitizeScript}<p>By ${results2[0].name}</p>`, lists, control)
      res.end(html);
    })
  })
}

exports.create = function(req, res, queryData){
  db.query("SELECT * FROM topic", function(error, results){
    if(error){
      throw error;
    }
    db.query("SELECT * FROM author", function(error2, authors){
      if(error2){
        throw error2;
      }
      var tag = "";
      for(let i = 0; i < authors.length; i++){
        tag += `<option value="${authors[i].id}">${sanitizeHtml(authors[i].name)}</option>`
      }
      const title = "Create";
    const script = `<form action="/create_process" method="post">
<p><input type="text" name="title" placeholder="title"></p>
<p>
  <textarea name="description" placeholder="description"></textarea>
</p>
<p>
<select name="author">
${tag}
</p>
<p>
  <input type="submit">
</p>
</form>
`;
    var lists = template.list(results);
    var html = template.html(title, script, lists, "");
    res.end(html)
    })
  })
}

exports.create_process = function(req, res, queryData){
  var body = "";
    req.on("data", function (data) {
      body = body + data;
    })
    req.on("end", function () {
      var post = qs.parse(body);
        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`, [post.title, post.description, post.author], function(error, results){
          if(error){
            throw error;
          }
          res.writeHead(302, { location: "/" });
          res.end();
        })
    })
}

exports.update = function(req, res, queryData){
  db.query("SELECT * FROM topic", function(error, result){
    if(error){
      throw error;
    }
    db.query("SELECT * FROM topic WHERE id=?", [queryData.id], function(error2, results){
      if(error2){
        throw error2;
      }
      db.query("SELECT * FROM author", function(error3, authors){
        if(error2){
          throw error3;
        }
        var tag = "";
        var selected = "";
        for(let i = 0; i < authors.length; i++){
          if(results[0].author_id === authors[i].id){
            selected = " selected";
          }
          else{
            selected = "";
          }
          tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`
        }

      var lists = template.list(result);
      var script = `<form action="/update_process" method="post">
   <p><input type="hidden" name="id" value="${queryData.id}"></p>
   <p><input type="text" name="title" placeholder="title"></p>
   <p>
     <textarea name="description" placeholder="description"></textarea>
   </p>
   <p>
  <select name="author">
  ${tag}
  </p>
   <p>
     <input type="submit">
   </p>
 </form>`;
      var html = template.html("", script, lists, "")
      res.end(html)
      })
    })
  })
}

exports.update_process = function(req, res, queryData){
  var body = "";
    req.on("data", function (data) {
      body = body + data;
    })
    req.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var data = post.description;
      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [title, data, post.author, id], function(error, results){
        if(error){
          throw error;
        }
        res.writeHead(302, { location: "/" });
        res.end();
      })
    })
}

exports.delete_process = function(req, res, queryData){
  var body = "";
    req.on("data", function (data) {
      body = body + data;
    })
    req.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      db.query("DELETE FROM topic WHERE id=?", [id], function(error, results){
        if(error){
          throw error;
        }
          db.query("ALTER TABLE topic AUTO_INCREMENT=?", [Number(id)], function(error2, results2){
            if(error2){
              throw error2;
            }
            res.writeHead(302, { location: "/" });
            res.end();
          })
      })
    })
}