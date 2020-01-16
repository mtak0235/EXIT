var mysql = require('mysql');


var db = mysql.createConnection({
   host: '168.131.35.112',
   user: 'luda',
   password: '1004tmk.',
   database: 'exit_db'
});

db.connect((err) => {
   if (err) return console.log(err);
   console.log("성공");
})
module.exports = db;
   
 