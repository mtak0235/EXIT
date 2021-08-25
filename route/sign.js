var express = require('express');
var db = require("../dbconnect");
var router = express.Router();

router.get('/', function (req, res) { //localhost:3000
    res.render('main', { isLogined: req.session.logined, nickname: req.session.nickname });
    console.log(req.session);
});

router.get("/api", (req,res)=>{
    if(req.session.logined){
       return  res.send({result:true})
    }
    return res.send({result:false})
})

router.get("/location", (req, res)=>{
    db.query('select category, latitude, longitude from board', (err, rows)=>{
        console.log(err);
        console.log(rows);
        res.send({result: rows})
    })
})

//////회원가입
//라우팅 함수 등록
router.get('/signup', function (req, res) {
    res.render('signup');
});

router.post('/signup', function (req, res, next) {
    var body = req.body;
    var name = req.body.name;
    var password = req.body.pw;
    var email = req.body.email;
    var phone = req.body.phone;
    var nickname = req.body.nickname;

    db.query("insert into user ( name,email, pw,nickname, phone_number) values(?, ?, ?, ?,?)",
        [name, email, password, nickname, phone], function (err, rows) {

            console.log(err);
            console.log("rows :" + rows);
            res.redirect('/login');
        });
});

/////로그인
router.get('/login', function (req, res) {
    var session = req.session;
    res.render('login');
});

router.post('/login', function (req, res) {
    console.dir(req.body);
    console.log('ㅇㄹ' + req.body);
    var userEmail = req.body.email;
    var password = req.body.pw;

    db.query('select * from user where email = ?', [userEmail], function (err, rows) {
        if (err) throw (err);
        else {
        
            if (rows.length === 0) {
                res.json({ success: false, msg: '해당 유저가 존재하지 않습니다.' });
            }
            else {
                console.log(rows[0].pw);
                if (password !== rows[0].pw) {
                    res.json({ success: false, msg: '비밀번호가 일치하지 않습니다.' });
                } else {

                    req.session.name = rows[0].userNickname;
                    req.session.email = rows[0].email;
                    req.session.logined = true;

                    req.session.save(function () {
                        res.redirect('/');
                    });
                }
            }
        }
    });
});

//로그아웃
router.get('/logout', function (req, res, next) {
    if (req.session) {
        console.log('로그아웃');
        req.session.destroy(function (err) {

            if (err) {
                console.log('세션 삭제시 에러');
                return;
            }

            console.log('세션 삭제 성공');
            res.redirect('/');
        });
        console.log(req.session);
    }
    else {
        console.log('로그인 안됨');
        res.redirect('/login');
    }
});

router.get('/read', function (req, res, next) {

    console.log(req.query);
    console.log('어라' + req.query.lon);
    console.log('어디' + req.query.lat);

    var po_lon = req.query.lon;    //지도에서 마우스를 클릭한 지점의 위치   req.body.longitude
    var po_lat = req.query.lat;        //req.body.latitude;
    var context;

    var main_board = db.query("select context,email,latitude,longitude from board where latitude = ? and longitude = ?", [po_lat, po_lon], function(err, rows) {
        if(err) console.log(err);
        var  result =[];
        for (i=0; i<rows.length ; i++){    
                result.push({
                    context:rows[i].context,
                    email:rows[i].email
                });

        }       
        res.render('read', {title:'게시판',rows:result});
    });
});

module.exports = router;
