var mysql = require("mysql");
require('dotenv')

var dbConnectionn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Thesis"
  });

  // var db = mysql.createPool({
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  // });


let sql = 'SELECT * FROM User';

// dbConnectionn.query (sql, function (err,results){
//   if (err) throw err;
//   console.log(results);
// });

module.exports = dbConnectionn
// module.exports = db