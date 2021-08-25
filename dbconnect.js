var mysql = require('mysql');
var db = mysql.createConnection({
   host: '안알려줄 예정',
   user: 'luda',
   password: '1004tmk.',
   database: 'exit_db'
});

db.connect((err) => {
   if (err) return console.log(err);
   console.log("성공");
})
module.exports = db;
