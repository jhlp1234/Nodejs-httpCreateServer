const mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql697521",
  database: "test"
});
db.connect();

module.exports = db;