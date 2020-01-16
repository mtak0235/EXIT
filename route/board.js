var express = require('express');
var mysql = require('mysql');

var database = {};
var db = require("../dbconnect");
var path = require('path');
var os = require("os");
var fs = require('fs');
var multer = require('multer');
var cors = require('cors');
var pythonShell = require('python-shell');
var router = express.Router();

//목록
router.get('/', function (req, res) { //localhost:3000/write 일 때
    res.render('position');
});


function downloadCSV(email, text) {

    var data = text;

    fs.writeFileSync('./route/result1.txt', data, 'utf-8');

    /* 
    var a =array.email + "," + array.text + "," + array.test + "\r\n";   
    var downloadLink = document.createElement("a");
    var blob = new Blob([a], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "../test/data.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); 
    */
}


    //데이터베이스에 글 저장
    router.post('/', function (req, res) {
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
        var nowLatitude = req.body.nowLatitude;
        var nowLongitude = req.body.nowLongitude;
        var text = req.body.text;
        var email = req.session.email;

        console.log('여기' + req.session);
        console.log(email);
        console.log(longitude);
        console.log(latitude);

        // 글 작성 가능 거리 범위 재설정
        // if ((latitude - nowLatitude)^2 >( 0.0015333685)^2 || (longitude - nowLongitude)^2 > (0.0015333685) {
        if (false) {
            res.status(403).end();
        } else {
            downloadCSV(email, text);

            var carnum = fs.readFileSync("./route/result.txt", 'utf-8');
            console.log(carnum);

            carnum = parseInt(carnum);
            console.log(carnum)

            db.query("insert into board (context,email ,longitude,latitude,create_at, category) values(?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 9 HOUR), ?)", [text, email, longitude, latitude, carnum], function (err, rows) {
                if (err) {
                    console.log(err);
                    db.rollback(function (err) {
                        console.error("rollback error1");
                    });
                } else {
                    console.log('정상작동');
                    return res.status(200).end();
                }
            });
        }
    });

module.exports = router;