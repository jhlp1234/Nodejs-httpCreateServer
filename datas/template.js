const sanitizeHtml = require("sanitize-html");

module.exports = {
  html: function (title, script, list, control) {

    return `<!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            <link rel="stylesheet" href="style.css">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <h2><a href="/author">Author</a></h2>
              ${list}
              ${control}
            <h2>${title}</h2>
              ${script}
          </body>
          </html>`
  },
  list: function (filelist) {
    var list = "<ol>"

    for (let i = 0; i < filelist.length; i++) {
      list += `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
    }
    list += "</ol>";

    return list;
  },
  author_list: function(result2){
    var list = "";
      for(let i = 0; i < result2.length; i++){
        list += `<tr>
        <td>${sanitizeHtml(result2[i].name)}</td>
        <td>${sanitizeHtml(result2[i].profile)}</td>
        <td><a href="/author/update?id=${result2[i].id}">Update</a></td>
        <td>
        <form action="/author/delete_process" method="post">
          <input type="hidden" name="id" value="${result2[i].id}">
          <input type="submit" value="Delete">
        </form>
        </td>
        </tr>`;
      }
      return list;
  }
}