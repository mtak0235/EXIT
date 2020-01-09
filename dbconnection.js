var mysql = require('mysql');

var db = mysql.createConnection({
    host :'localhost', // 서버 로컬 ip
    port:3306, //mysql 기본 포트번호는 3306
    user:'root', //계정 id
    password:'1004tmk.',//계정pw
    database:'exit_db'//접속할 db
    });

   module. exports = db;