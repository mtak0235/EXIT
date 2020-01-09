var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');
var cors = require('cors');
var db = require("./dbconnection");

var app = express();

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});
app.use(cookieParser());
app.use(session({
    secret: 'my key',
    debug: true,
    resave: false,
    saveUninitialized: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var userRouter = require('./route/sign');
var boardRouter = require('./route/board');
var noticeRouter = require('./route/notice');

app.use("/", userRouter);
app.use("/sign", userRouter);
app.use("/board", boardRouter);
app.use("/notice", noticeRouter);

app.use('/public', express.static(path.join(__dirname, 'public')));


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    var user = req.session.id;
    res.render('main', {user: user});
});


app.listen(app.get('port'), function () {
    console.log('Express server listening on port' + app.get('port'));
    console.log(process.env.NODE_PORT);
});