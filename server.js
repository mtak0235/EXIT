var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');
var cors = require('cors');
var mysql = require('mysql');
var db = mysql.createConnection({
    host :'localhost', // 서버 로컬 ip
    port:3306, //mysql 기본 포트번호는 3306
    user:'root', //계정 id
    password:'1004tmk.',//계정pw
    database:'exit_db'//접속할 db
    });
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs'); 

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

app.use(cookieParser());
app.use(session({
    secret: 'my key',
    debug: true,
    resave: true,
    saveUninitialized: true
}));

app.use('/static', express.static('docs'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get('/', function (req, res) {
//     var user = req.session.id;
//     res.render('main', {user: user});
// });

var userRouter = require('./route/sign');
var boardRouter = require('./route/board');
var noticeRouter = require('./route/notice');
var uploadRouter = require('./route/upload');

app.use("/", userRouter);
app.use("/sign", userRouter);
app.use("/board", boardRouter);
app.use("/notice", noticeRouter);

// app.use("/", noticeRouter);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port' + app.get('port'));
    console.log(process.env.NODE_PORT);
});