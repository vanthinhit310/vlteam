var express = require('express');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');
var readChunk = require('read-chunk');
var session = require('express-session');
var fileType = require('file-type');
var moment = require('moment');
var _ = require('underscore');
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nodes = {};
var mangUsers = [];
var mangUsersLiveCode = [];
const {Pool, Client} = require('pg');
const pool = new Pool({
    user: 'jenhnltobjifnz',
    host: 'ec2-54-204-21-226.compute-1.amazonaws.com',
    database: 'df07n687imb2qc',
    password: '9b0b4ec6667eaa650169c1b1ee6510a0b81bfaca52643c853d93b3ce609a512a',
    port: 5432, ssl: true

});

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.set('view options', {layout: false});
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// Tell express to serve static files from the following directories
// app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use('/upload', express.static('upload'));
app.use(session({secret: "Shh, its a secret!"}));
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
var accountRouter = require('./routes/account');

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/account', accountRouter);


app.use(function (req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.get('/message', function (req, res) {
    if (req.session.acc === undefined) {
        res.redirect('/');
    } else {
        res.render('message', {title: 'Trang chủ', User: req.session.acc});
    }
});

io.on("connection", function (socket) {
    console.log("Co nguoi ket noi " + socket.id);

    socket.on("client-send-Username", function (data) {
        if (mangUsers.indexOf(data) >= 0) {
            socket.emit("server-send-dki-thatbai");
        } else {
            mangUsers.push(data);
            socket.Username = data;
            socket.emit("server-send-dki-thanhcong", data);
            io.sockets.emit("server-send-danhsach-Users", mangUsers);
        }
    });

    socket.on('client-send-code', function (data) {
        socket.broadcast.emit("server-send-code", data);
    });


    socket.on("logout", function () {
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
    });

    socket.on("user-send-message", function (data) {
        io.sockets.emit("server-send-mesage", {un: socket.Username, nd: data});
    });

    socket.on("user-send-message-sendfile", function (data) {
        socket.broadcast.emit("server-send-mesage", {un: socket.Username, nd: data});
    });

    socket.on("toi-dang-go-chu", function () {
        var s = socket.Username + " đang nhập gì đó";
        io.sockets.emit("ai-do-dang-go-chu", s);
    });

    socket.on("toi-stop-go-chu", function () {
        io.sockets.emit("ai-do-STOP-go-chu");
    });
    socket.on('disconnect', function () {
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
    });
});

app.get("/file", function (req, res) {
    var fileName = req.query.fileName;
    res.sendFile(__dirname + "/upload/" + fileName);
});

app.get('/download', function (req, res) {
    var fileName = req.query.fileName;
    var file = __dirname + "/upload/" + fileName;
    res.download(file); // Set disposition and send it.
});

app.post('/upload_photos', function (req, res) {
    var time = Date.now();
    var photos = [],
        form = new formidable.IncomingForm();

    // Tells formidable that there will be multiple files sent.
    form.multiples = true;
    // Upload directory for the images
    form.uploadDir = path.join(__dirname, 'tmp_uploads');

    // Invoked when a file has finished uploading.
    form.on('file', function (name, file) {
        // Allow only 3 files to be uploaded.
        if (photos.length === 1) {
            fs.unlink(file.path);
            return true;
        }

        var buffer = null,
            type = null,
            filename = '';

        buffer = readChunk.sync(file.path, 0, 262);
        type = fileType(buffer);

        // Check the file type, must be either png,jpg or jpeg

        // Assign new file name
        filename = time + '_' + file.name;

        // Move the file with the new file name
        fs.rename(file.path, path.join(__dirname, 'upload/' + filename));

        // Add to the list of photos
        photos.push({
            status: true,
            filename: filename,
            type: type !== null ? type.ext : 'text',
            publicPath: 'upload/' + filename
        });

    });

    form.on('error', function (err) {
        console.log('Error occurred during processing - ' + err);
    });

    // Invoked when all the fields have been processed.
    form.on('end', function () {
        console.log('All the request fields have been processed.');
    });

    // Parse the incoming form fields.
    form.parse(req, function (err, fields, files) {
        res.status(200).json(photos);
    });
});


app.post('/thembaiviet', function (req, res) {
    var photos = [],
        form = new formidable.IncomingForm();
    var time = Date.now();
    // Tells formidable that there will be multiple files sent.
    form.multiples = true;
    // Upload directory for the images
    form.uploadDir = path.join(__dirname, 'tmp_uploads');

    // Invoked when a file has finished uploading.
    form.on('file', function (name, file) {
        // Allow only 3 files to be uploaded.
        if (photos.length === 7) {
            fs.unlink(file.path);
            return true;
        }

        var buffer = null,
            type = null,
            filename = '';

        buffer = readChunk.sync(file.path, 0, 262);
        type = fileType(buffer);

        // Check the file type, must be either png,jpg or jpeg
        if (type !== null) {
            // Assign new file name
            filename = time + '_' + file.name;

            // Move the file with the new file name
            fs.rename(file.path, path.join(__dirname, 'upload/' + filename));

            // Add to the list of photos
            photos.push(filename);
        } else {
            photos.push('no');
            fs.unlink(file.path);
        }
    });

    form.on('field', function (name, value) {
        photos.push(value);
    });

    form.on('error', function (err) {
        console.log('Error occurred during processing - ' + err);
    });

    // Invoked when all the fields have been processed.
    form.on('end', function () {
        console.log('All the request fields have been processed.');
    });

    // Parse the incoming form fields.
    form.parse(req, function (err, fields, files) {
        var user = req.session.acc;
        var mabaiviet = Date.now();
        var tenbaiviet = user.name;
        var thoigian = moment().format('L') + "  " + moment().format('LTS');
        var danhgia = 0;
        var hinhanh = getAllImgVideo(photos);
        var dinhkem = getAllTep(photos);
        ; // tệp đính kèm
        var email = user.email;
        var noidung = getContent(photos);
        var sql = "insert into baiviet values('" + mabaiviet + "','" + tenbaiviet + "','" + thoigian + "'," + danhgia + ",'" + hinhanh + "','" + email + "','" + noidung + "','" + dinhkem + "')";
        pool.query(sql, (err, data) => {
            if (err) {
                res.json({data: 'fail'});
                return;
            }
            res.redirect("/");
        });
    });
});

function getAllImgVideo(listAll) {
    // chỉ nhận mp3,mp4
    let listaaa = [];
    for (let fileName of listAll) {
        if (getPhanMoRong(fileName) === 'jpg' || getPhanMoRong(fileName) === 'png' || getPhanMoRong(fileName) === 'mp3' || getPhanMoRong(fileName) === 'mp4') {
            listaaa.push(fileName);
        }
    }
    return listaaa.join(':');
}

function getContent(listAll) {
    // chỉ nhận mp3,mp4
    let listaaa = [];
    for (let fileName of listAll) {
        if (getPhanMoRong(fileName) === 'no') {
            listaaa.push(fileName);
        }
    }
    return listaaa.join('');
}

function getPhanMoRong(fileName) {
    if (fileName === undefined) {
        return 'no';
    }
    if (fileName.indexOf('.') === -1) {
        return 'no';
    }
    let ext = fileName.split('.');
    return ext[ext.length - 1];
}

function getAllTep(listAll) {
    // chỉ nhận zip, rar, exe
    let listaaa = [];
    for (let fileName of listAll) {
        if (getPhanMoRong(fileName) !== 'no' && getPhanMoRong(fileName) !== 'png' && getPhanMoRong(fileName) !== 'jpg' && getPhanMoRong(fileName) !== 'mp3' && getPhanMoRong(fileName) !== 'mp4') {
            listaaa.push(fileName);
        }
    }
    return listaaa.join(':');
}

process.env.TZ = 'Asia/Ho_Chi_Minh';
server.listen(process.env.PORT || 3000);
