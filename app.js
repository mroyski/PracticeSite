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
app.use('/', function(req, res, next) {
  console.log('Request Url:' + req.url);

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'addressbook'
  });
  console.log(con);
  con.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
  });
  con.query('SELECT * FROM addressbook.family;', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    console.log('The solution is: ', results);
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

app.get('/family/:firstname', function(req, res) {
  res.send(req.params);
});

app.post('/submit-form', (req, res) => {
  let userinfo = req.body;
  console.log(userinfo);
  res.send('Submitted succesfully!');
});

app.listen(port);
