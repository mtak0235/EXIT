var express = require('express');
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
var ejs = require('ejs');

var router = express.Router();

//목록
router.get('/', function(req, res) {
    db.query('select noticeNo, noticeTitle, hit, DATE_FORMAT(curdate(), "%Y.%m.%d") as createAt from notice', function(err, rows) {
        if (err) {
            console.log(err);
        }
        console.log(rows);
        res.render('notice', {rows: rows, isLogined: req.session.logined, nickname: req.session.name});
    })

});

//읽기
router.get('/read/:noticeNo', function(req, res, next) {
    var noticeNo = req.params.noticeNo;
    console.log("noticeNo : " + noticeNo);

    db.beginTransaction(function(err) {
        db.query('update notice set hit = hit + 1 where noticeNo=?', [noticeNo], function(err) {
            if (err) {
                console.log(err);
                db.rollback(function () {
                    console.error('rollback error1');
                });
            }
            db.query('select noticeNo, noticeTitle, noticeContents, DATE_FORMAT(curdate(), "%Y.%m.%d") as createAt, hit from notice where noticeNo=?', [noticeNo], function(err, rows) {
                if (err) {
                    console.log(err);
                    db.rollback(function () {
                        console.error('rollback err2');
                    })
                }
                else {
                    db.commit(function (err) {
                        if (err) console.log(err);
                        console.log("row : " + rows);
                        res.render('read', {title: rows[0].noticeTitle, rows: rows});
                    })
                }
            
            });
        });
    });
    
});

module.exports = router;