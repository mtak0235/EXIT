var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
var database ={}; 
var db = mysql.createConnection({
    host :'localhost', // 서버 로컬 ip
    port:3306, //mysql 기본 포트번호는 3306
    user:'root', //계정 id
    password:'1004tmk.',//계정pw
    database:'exit_db'//접속할 db
    });
var fs = require('fs');
var router = express.Router();

router.get('/', function (req, res) { //localhost:3000
    res.render('main', {isLogined: req.session.logined, nickname: req.session.name});
});

//////회원가입
//라우팅 함수 등록
router.get('/signup', function(req, res) {
     res.render('signup')
});

router.post('/signup', function(req, res, next) {
    var body = req.body;
    var name = req.body.name;
    var password = req.body.pw;
    var email = req.body.email;
    var phone = req.body.phone;
    var nickname = req.body.nickname;
      
    db.query("insert into user ( name,email, pw,nickname, phone_number) values(?, ?, ?, ?,?)",
     [name, email, password, nickname, phone], function(err, rows) {
       
        console.log(err)
        console.log("rows :" + rows);       
        res.redirect('/login');
     });   
});

/////로그인
router.get('/login', function(req, res) {
    var session = req.session;
    res.render('login');
});

router.post('/login', function(req, res) {
    console.log('ㅇㄹ'+req.body);
    var userEmail = req.body.email;
    var password = req.body.pw;
  
    db.query('select * from user where email = ?', [userEmail], function(err, rows) {console.log(rows)
        if (err) throw(err);
        else {
            if (rows.length === 0) {
                res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
            }
            else {  console.log(rows[0].pw);
                if (password !== rows[0].pw) {
                    res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
                } else {
                    req.session.no = rows[0].No;
                    req.session.name = rows[0].userNickname;
                    req.session.logined = true;
                    console.log(req.session.no);
                    req.session.save(function() {
                    
                    res.redirect('/');
                    });
                }
            }
        }
    });
});

//로그아웃
router.get('/logout', function(req, res, next) {
    if (req.session) {
        console.log('로그아웃');
        req.session.destroy(function(err) {
            
            if (err) {
                console.log('세션 삭제시 에러');
                return;
            }
            
            console.log('세션 삭제 성공');
            res.redirect('/');
        })
    }
    else {
        console.log('로그인 안됨');
        res.redirect('/login');
    }
});

router.get('/read',  function(req, res, next) {
   res.render('read');
});
router.get('/position',  function(req, res, next) {
   res.render('position');
});
router.get('/write',  function(req, res, next) {
   res.render('write');
});


module.exports = router;