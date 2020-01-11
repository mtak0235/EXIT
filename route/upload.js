var express = require('express');
var path = require('path');
var mysql = require('mysql');
var mysql = require('mysql');

var database ={}; 
var db = mysql.createConnection({
    host :'localhost', // 서버 로컬 ip
    port:3306, //mysql 기본 포트번호는 3306
    user:'root', //계정 id
    password:'1004tmk.',//계정pw
    database:'exit_db'//접속할 db
    });
var fs = require('fs');
var multer = require('multer');
var cors = require('cors');
var ejs = require('ejs');

//multer 기본설정(파일 저장)
var storage = multer.diskStorage({
    destination: function(req, res, callback) {
        callback(null, 'uploads');
    },
    filename: function(req, file, callback) {
        var extention = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extention);
        callback(null, basename + Date.now() + extention);
    }
});
    
var upload = multer({
    storage:storage,
    limits:{
        files:5
    }
});

var router = express.Router();

router.post('/', upload.array('file', 1), function(req, res) {
    
    var files = req.files;
    console.log('==== 업로드된 파일 ====');
    if (files.length > 0) {
        console.dir(files[0]);
    }
    else {
        console.log('파일이 없습니다');
    }

    var originalname;
    var filename;
    var mimetype;
    var size;

    if(Array.isArray(files)) {
        for(var i = 0; i > files.length; i++) {
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }

    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write("<p>원본파일 : " + originalname + "</p>");
    res.write("<p>저장파일 : " + filename + "</p>");
    res.end();
})

module.exports = router;