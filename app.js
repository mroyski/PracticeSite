var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
var flist = require('./family.json');
var content = require('./content.json');

var app = express();
var port = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

app.use(bodyParser.text({ type: 'text/html' }));
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use('/', function(req, res, next) {
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'addressbook'
  });
  con.connect(function(err) {
    if (err) throw err;
  });
  con.query('SELECT * FROM addressbook.family;', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
  });
  next();
});

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/api', function(req, res) {
  res.render('api');
});

app.get('/aboutme', function(req, res) {
  res.render('template', { content: content.aboutme });
  console.log(content.aboutme);
});

app.get('/api/aboutme', function(req, res) {
  res.json(content.aboutme);
});

app.get('/music', function(req, res) {
  res.render('template', { content: content.music });
});

app.get('/api/music', function(req, res) {
  res.json(content.music);
});

app.get('/contact', function(req, res) {
  res.render('contact');
});

app.get('/family', function(req, res) {
  res.render('family', { flist: flist });
});

// app.get('/familydetails/:firstname', function(req, res) {
//   res.send(req.params);
//   var details = req.params;
//   console.log(details);
//   res.render('familydetails', { details: details });
// });

app.get(
  '/family/:firstname',
  function(req, res, next) {
    console.log('First Name:', req.params.firstname);
    next();
  },
  function(req, res, next) {
    res.send(req.params.firstname);
  }
);

app.get('/family/:firstname', function(req, res, next) {
  res.end(req.params.firstname);
});

app.get('/api/family', function(req, res) {
  res.json(flist);
});

app.post('/submit-form', urlencodedParser, (req, res) => {
  let sampleFile = req.files.sampleFile;
  sampleFile.mv('./public/img/filename.jpg', function(err) {
    if (err) return res.status(500).send(err);
  });
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'addressbook'
  });
  if (req.body.firstname === '' || !req.body.lastname || !req.body.email) {
    res.status(500);
    res.render(
      'error',
      'form info is missing, submit first name, last name, and email'
    );
  }
  con.connect(function(err) {
    if (err) throw err;
    let userinfo = req.body;
    var sql = `INSERT INTO family (firstname, lastname, email) VALUES ('${userinfo.firstname}', '${userinfo.lastname}', '${userinfo.email}');`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log('1 record inserted');
    });
    res.write('Submitted succesfully!');
    res.write('File uploaded!');
    res.end();
  });
});

app.get('/guestbook', jsonParser, function(req, res) {
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'addressbook'
  });
  con.connect(function(err) {
    if (err) throw err;
    var sql = 'SELECT * FROM family';
    con.query(sql, function(err, result) {
      if (err) {
        throw err;
      } else {
        res.render('guestbook', { result: result });
      }
    });
  });
});

app.get('/api/guestbook', function(req, res) {
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'addressbook'
  });
  con.connect(function(err) {
    if (err) throw err;
    var sql = 'SELECT * FROM family';
    con.query(sql, function(err, result) {
      if (err) {
        throw err;
      } else {
        res.json(result);
      }
    });
  });
});

// FILE UPLOADER
app.get('/upload', function(req, res) {
  res.render('upload');
});

app.listen(port);
