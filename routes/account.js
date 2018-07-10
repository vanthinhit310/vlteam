var express = require('express');
var router = express.Router();
const {Pool, Client} = require('pg');
var nodemailer = require('nodemailer');


const pool = new Pool({
    user: 'jenhnltobjifnz',
    host: 'ec2-54-204-21-226.compute-1.amazonaws.com',
    database: 'df07n687imb2qc',
    password: '9b0b4ec6667eaa650169c1b1ee6510a0b81bfaca52643c853d93b3ce609a512a',
    port: 5432, ssl: true

});
router.get('/logout', function (req, res, next) {
    req.session.acc = undefined;
    res.json({
        data: 'ok'
    });
});

router.get('/destroy', function (req, res, next) {
    var email = req.session.acc.email;
    var sql = "delete from account where email='" + email + "'";
    pool.query(sql, (err, account) => {
        if (err) {
            res.json({data: 'fail'});
        }
        req.session.acc = undefined;
        res.json({data: 'ok'});
    });
});

router.get('/changeimage', function (req, res, next) {
    var imgNew = req.query.hinhanh;
    var email = req.session.acc.email;

    var sql = "update account set hinhanh='" + imgNew + "' where email='" + email + "'";
    pool.query(sql, (err, account) => {
        if (err) {
            res.json({data: 'fail'});
            return;
        }
        res.json({data: 'ok'});
    });
});



router.get('/changIP', function (req, res, next) {
    if (req.session.acc === undefined) {
        res.redirect('/');
    } else {
        var email = req.session.acc.email;
        var newIP = req.query.ip;


        pool.query("update account set ip='" + newIP + "' where email='" + email + "'", (err, account) => {
            if (err) return res.send({data: 'fail'});
            req.session.acc.ip = newIP;
            res.send({data: 'ok'});
        });
    }
});


router.get('/profile', function (req, res, next) {
    if (req.session.acc === undefined) {
        res.redirect('/');
    } else {

        var email = req.query.email;
        pool.query("SELECT * from account where email='" + email + "'", (err, account) => {
            pool.query("SELECT * from baiviet where email='" + email + "'", (err, baiviet) => {
                res.render('profile', {
                    title: email,
                    User: req.session.acc,
                    UserProfile: account.rows[0],
                    DsBaiVietCuaUS: baiviet.rows,
                    tonTai: tonTai
                });
            });
        });
    }
});


function tonTai(email, listEmail) {
    let emailArr = listEmail.split(',');
    if (emailArr.length === 0) {
        console.log(3);
        return undefined;
    }
    for (let e of emailArr) {
        if (e === email) {
            return e;
        }
    }

    return undefined;
}

module.exports = router;
