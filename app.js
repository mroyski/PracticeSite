var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const flist = require('./family.json');

var app = express();

var port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

app.use('/assets', express.static(__dirname + '/public'));
// app.use(express.urlencoded());
// app.use(bodyParser.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'addressbook'
});

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

app.get('/aboutme', function(req, res) {
  res.render('aboutme');
});

app.get('/music', function(req, res) {
  res.render('music');
});

app.get('/contact', function(req, res) {
  res.render('contact');
});

app.get('/family', function(req, res) {
  res.render('family', { flist: flist });
});

app.get('/familydetails/:firstname', function(req, res) {
  res.send(req.params);
  var details = req.params;
  console.log(details);
  res.render('familydetails', { details: details });
});

app.post('/submit-form', urlencodedParser, (req, res) => {
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
    res.send('Submitted succesfully!');
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

app.listen(port);
