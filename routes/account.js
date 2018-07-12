var express = require('express');
var router = express.Router();
const {Pool, Client} = require('pg');
var nodemailer = require('nodemailer');


const pool = new Pool({
    user: 'fwhdqmtzdjcqtc',
    host: 'ec2-107-22-169-45.compute-1.amazonaws.com',
    database: 'db8h9nks4rhj7d',
    password: 'a6eb3437dcb42519167354f6894f770830328ae1b024ee61590520f8a207da4d',
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
