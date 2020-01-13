var express = require('express');
var mysql = require('mysql');

var database = {};
var db = require("../dbconnect")
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var cors = require('cors');
var router = express.Router();

//목록
router.get('/', function (req, res) { //localhost:3000/board 일 때

    db.query('select * from board  where userNum = No', function (err, rows) {
        if (err) {
            console.log(err);
        }
        console.log(rows);
        res.render('board', { rows: rows, isLogined: req.session.logined, nickname: req.session.nickname });
    });
});

//읽기
router.get('/detail/:postId', function (req, res, next) { //localhost:3000/board/detail/:postId
    var postId = req.params.postId;
    console.log("postId : " + postId);

    db.query('update post set hit = hit + 1 where postId=?', [postId], function (err) {
        if (err) {
            console.log(err);
            db.rollback(function () {
                console.error('rollback error1');
            });
        }
        db.query('select postId, postTitle, postContents, genre, DATE_FORMAT(createAt, "%Y %c/%e %r") as createAt, hit, file, userNickname from post, user where userNum = no and postId=?', [postId], function (err, post) {
            if (err) {
                console.log(err);
                db.rollback(function () {
                    console.error('rollback err2');
                });
            }
            db.query('select commentNo, postId, userNum, contents, DATE_FORMAT(createAt, "%Y % c/%e %r") as createAt, userNickname from comment, user where userNum=no and postId = ?', [postId], function (err, comment) {
                if (err) {
                    console.log(err);
                    db.rollback(function () {
                        console.error('rollback err3');
                    });
                }
                else {
                    db.commit(function (err) {
                        if (err) console.log(err);
                        console.log("row : " + post);
                        res.render('detail', { title: post[0].postTitle, post: post, comment: comment, isLogined: req.session.logined });
                    });
                }
            });
        });
    });


    //댓글 쓰기
    router.post('/:postId/process/comment', function (req, res) {
        var body = req.body;
        var postId = req.params.postId;
        var content = req.body.content;
        var writer = req.session.no;

        db.query('insert into comment (postId, contents, userNum, createAt) values (?, ?, ?, DATE_ADD(NOW(), INTERVAL 9 HOUR))', [postId, content, writer], function (err, comment) {
            if (err) throw (err);
            res.redirect('/board/detail/' + postId);
        });
    });
});

//쓰기
router.get('/write', function (req, res, next) {
    res.render('/', { isLogined: req.session.logined, nickname: req.session.name });  // write를 /로 랜더 했어요.
});

//데이터베이스에 글 저장
router.post('/write', function (req, res, next) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var text = req.body.text;
    var email = req.session.email;

    console.log('여기' + req.session);

    console.log(email);
    console.log(longitude);
    console.log(latitude);

    db.query("insert into board (context,email ,longitude,latitude,create_at,postId) values(?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 9 HOUR),1)", [text, email, longitude, latitude], function (err, rows) {
        if (err) {
            console.log(err);
            db.rollback(function (err) {
                console.error("rollback error1");
            });
        }
        console.log('정상작동');
        res.render('main');
    });
});

//수정
router.get('/edit/:postId', function (req, res, next) {
    var postId = req.params.postId;

    db.query('select postId, postTitle, postContents, file from post where postId = ?', [postId], function (err, rows) {
        if (err) {
            console.log(err);
        }
        res.render('edit', { postId: postId, rows: rows });
    });

});

router.post('/edit/:postId', function (req, res, next) {
    var body = req.body;
    var postId = req.params.postId;
    var title = req.body.title;
    var content = req.body.content;
    var file = req.body.file;

    db.query('update post set postTitle = ?, postContents = ?, file = ?, createAt = DATE_ADD(NOW(), INTERVAL 9 HOUR) where postId = ?', [title, content, file, postId], function (err, rows) {
        if (err) {
            console.log(err);
        }
        res.render('edit', { postId: postId, rows: rows });
        res.redirect('/board/detail/' + postId);
    });
});

//삭제
router.get('/delete/:postId', function (req, res, next) {
    var postId = req.params.postId;


    db.beginTransaction(function (err) {
        db.query('delete from post where postId = ?', [postId], function (err) {
            if (err) {
                console.log(err);
                db.rollback(function (err) {
                    console.error('rollback error1');
                });
            }
            db.query('ALTER TABLE post AUTO_INCREMENT=1');
            db.query('SET @COUNT = 0');
            db.query('UPDATE post SET postId = @COUNT:=@COUNT+1', function (err, rows) {
                if (err) {
                    console.log(err);
                    db.rollback(function (err) {
                        console.error('rollback error2');
                    });
                }
                else {
                    res.redirect('/board');
                }
            });
        });
    });
});


module.exports = router;