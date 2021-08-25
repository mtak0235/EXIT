var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');
var app = express();
var userRouter = require('./route/sign');
var boardRouter = require('./route/board');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
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
app.use("/", userRouter);
app.use("/sign", userRouter);
app.use("/write", boardRouter);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port' + app.get('port'));
});
