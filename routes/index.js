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

router.get('/admin', function (req, res, next) {
    var acc = req.session.acc;
    if (acc != null) {
        if (acc.email === 'admin') {
            pool.query('SELECT * from account', (err, dataAcc) => {

                res.render('admin', {
                    title: 'Quản lí',
                    listUser: dataAcc.rows
                });

            });
        } else {
            res.redirect('/logoutAsAdmin');
        }

    } else {
        res.redirect('/');
    }

});

router.get('/', function (req, res, next) {
    pool.query('SELECT * from account', (err, dataAcc) => {
        if (!req.session.acc) {
            res.render('index', {
                title: 'Trang chủ',
                listUser: dataAcc.rows,
                User: undefined
            });
        } else {
            pool.query('SELECT * from baiviet ORDER BY mabaiviet DESC', (err, data) => {
                if (!req.session.acc) {
                    res.render('index', {title: 'Trang chủ', listUser: data.rows, User: undefined});
                } else {
                    pool.query('SELECT * from binhluanbaiviet  ORDER BY mabinhluan DESC', (err, dsBinhLuan) => {
                        res.render('post', {
                            title: 'Post',
                            listUser: dataAcc.rows,
                            User: req.session.acc,
                            Post: data.rows,
                            getUserOfBaiVietVaBinhLuan: getUserOfBaiVietVaBinhLuan,
                            getDSBinhLuan: getDSBinhLuan(data.rows, dsBinhLuan.rows),
                            getPhanMoRong: getPhanMoRong
                        });
                    });
                }
            });
        }
    });

});

function getPhanMoRong(fileName) {
    if (fileName === undefined) {
        return '';
    }
    var ext = fileName.split('.');
    return ext[ext.length - 1];
}

function getDSBinhLuan(dsPost, dsBinhLuan) {
    var list = [];
    for (var i = 0; i < dsPost.length; i++) {
        var post = dsPost[i];
        list[post.mabaiviet] = getBinhLuanTheoMa(dsBinhLuan, post.mabaiviet);
    }
    return list;
}

function getBinhLuanTheoMa(dsBinhLuan, maBaiViet) {
    var ds = [];
    dsBinhLuan.forEach(function (data) {
        if (data.mabaiviet === maBaiViet) {
            ds.push(data);
        }
    });
    return ds;
}

function getUserOfBaiVietVaBinhLuan(rowsAcc, email) {
    for (var i = 0; i < rowsAcc.length; i++) {
        var acc = rowsAcc[i];
        if (acc.email === email) {
            return acc;
        }
    }
    return undefined;
}

router.get('/loginAsAdmin', function (req, res, next) {
    var email = req.query.email;
    var ps = req.query.pass;

    var acc = new account(email, ps, '', '', '', '', '', '', 0);
    var isLogin = false;


    // tại đây kiểm tra trong database rồi trả về kết quả
    pool.query('SELECT * from account', (err, data) => {
        if (data === undefined) {
            res.redirect('/admin');
            return;
        } else {
            var rows = data.rows;
            var check = checkaccout(rows, acc);
            if (check !== -1) {
                var taikhoan = rows[check];
                req.session.acc = taikhoan;
                res.redirect('/');
            } else {
                res.redirect('/admin');
            }
        }
    });
});

router.get('/logoutAsAdmin', function (req, res, next) {
    req.session.acc = undefined;
    res.redirect('/');
});


router.get('/login', function (req, res, next) {
    var email = req.query.email;
    var ps = req.query.pass;

    var acc = new account(email, ps, '', '', '', '', '', '', 0);
    var isLogin = false;


    // tại đây kiểm tra trong database rồi trả về kết quả
    pool.query('SELECT * from account', (err, data) => {
        if (data === undefined) {
            res.json({data: 'fail'});
            return;
        } else {
            var rows = data.rows;
            var check = checkaccout(rows, acc);
            if (check !== -1) {
                var taikhoan = rows[check];
                req.session.acc = taikhoan;
                res.json({data: 'ok', name: taikhoan.name});
            } else {
                res.json({data: 'fail'});
            }
        }
    });
});

function account(email, password, name, ip, hinhanh, banbe, baiviet, filedaup, danhgia) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.ip = ip;
    this.hinhanh = hinhanh;
    this.banbe = banbe;
    this.baiviet = baiviet;
    this.filedaup = filedaup;
    this.danhgia = danhgia;

    this.equals = function (that) {
        return this.email === that.email && this.password === that.password && this.password !== 'no';
    };

    this.checkEmail = function (that) {
        return this.email === that.email;
    }
}

function checkaccout(list, account) {
    for (var i = 0; i < list.length; i++) {
        var accc = list[i];
        if (account.equals(accc)) {
            return i;
        }
    }
    return -1;
}

function checkExist(list, account) {
    for (var i = 0; i < list.length; i++) {
        var accc = list[i];
        if (account.checkEmail(accc)) {
            return i;
        }
    }
    return -1;
}

router.get('/lienhe', function (req, res, next) {
    if (req.session.acc === undefined) {
        res.redirect('/');
    } else {

        res.render('lienhe', {
            TrangThai: req.session.trangthai,
            User: req.session.acc,
        });
    }
});

router.get('/addpost', function (req, res, next) {
    if (req.session.acc === undefined) {
        res.redirect('/');
    } else {

        res.render('addpost', {
            User: req.session.acc,
        });
    }
});

module.exports = router;
