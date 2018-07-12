var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');
var readChunk = require('read-chunk');
var session = require('express-session');
var fileType = require('file-type');
var _ = require('underscore');
var moment = require('moment');
const {Pool, Client} = require('pg');
let multer  = require('multer'); 
let upload  = multer({ storage: multer.memoryStorage() });
const pool = new Pool({
    user: 'fwhdqmtzdjcqtc',
    host: 'ec2-107-22-169-45.compute-1.amazonaws.com',
    database: 'db8h9nks4rhj7d',
    password: 'a6eb3437dcb42519167354f6894f770830328ae1b024ee61590520f8a207da4d',
    port: 5432, ssl: true

});
router.get('/xoabaiviet', function (req, res, next) {
    var mabaiviet = req.query.mabaiviet;
    var sql = "delete from baiviet where mabaiviet='" + mabaiviet + "'";
    pool.query(sql, (err, data) => {
        if (err) {
            res.json({data: 'fail'});
            return;
        }
        res.json({data: 'ok'});
    });
});

router.get('/xoabinhluan', function (req, res, next) {
    var mabinhluan = req.query.mabinhluan;
    var sql = "delete from binhluanbaiviet where mabinhluan='" + mabinhluan + "'";
    pool.query(sql, (err, data) => {
        if (err) {
            res.json({data: 'fail'});
            return;
        }
        res.json({data: 'ok'});
    });
});

router.get('/baoxau', function (req, res, next) {
    var mabaiviet = req.query.mabaiviet;
    var noiDung = "Báo xấu: " + mabaiviet;
    var thoigian = moment().format('L') + "  " + moment().format('LTS');
    var email = req.session.acc.email;
    var sql = "insert into phanhoi values('" + email + "','" + thoigian + "','" + noiDung + "')";
    pool.query(sql, (err, data) => {
        if (err) {
            res.json({data: 'fail'});
            return;
        }
        res.json({data: 'ok'});
    });
});


router.get('/themlienhe', function (req, res, next) {
    var noiDung = req.query.noidung;
    var thoigian = moment().format('L') + "  " + moment().format('LTS');
    var email = req.session.acc.email;
    var sql = "insert into phanhoi values('" + email + "','" + thoigian + "','" + noiDung + "')";
    pool.query(sql, (err, data) => {
        if (err) {
            res.json({data: 'fail'});
            return;
        }
        res.json({data: 'ok'});
    });
});

router.get('/addbinhluan', function (req, res, next) {
    var email = req.session.acc.email;
    var cheDo = req.query.chedo;
    var maBinhLuan = Date.now() + "_" + cheDo + "_" + email;
    var noidung = req.query.noidung;
    var mabaiviet = req.query.mabaiviet;
    var date = new Date();
    var thoiGian = date.getHours() + ":" + date.getMinutes() + " - " + date.getDay() + ":" + date.getMonth() + ":" + date.getYear();
    var sql = "insert into binhluanbaiviet values('" + maBinhLuan + "','" + noidung + "','" + mabaiviet + "','" + email + "','" + thoiGian + "')";

    pool.query(sql, (err, data) => {
        if (err) {
            res.json({data: 'fail'});
            return;
        }
        res.json({data: 'ok'});
    });

});

function Post(mabaiviet, tenbaiviet, thoigian, danhgia, hinhanh, email, noidung, dinhkem) {
    this.mabaiviet = mabaiviet;
    this.tenbaiviet = tenbaiviet;
    this.thoigian = thoigian;
    this.danhgia = danhgia;
    this.hinhanh = hinhanh;
    this.email = email;
    this.noidung = noidung;
    this.dinhkem = dinhkem;
}

function getAllPost() {
    pool.query('SELECT * from baiviet', (err, data) => {
        if (err) return undefined;
        return data.rows;
    });
}

function getAllAccount() {
    pool.query('SELECT * from account', (err, data) => {
        if (err) return undefined;
        return data.rows;
    });
}

module.exports = router;
