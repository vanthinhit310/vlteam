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
    user: 'jenhnltobjifnz',
    host: 'ec2-54-204-21-226.compute-1.amazonaws.com',
    database: 'df07n687imb2qc',
    password: '9b0b4ec6667eaa650169c1b1ee6510a0b81bfaca52643c853d93b3ce609a512a',
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
