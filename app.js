var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

app.use('/assets', express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
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
  res.render('family');
});

app.get('/family/:name', function(req, res) {
  res.render('person', { Id: req.params.id, Qstr: req.query.qstr });
});

app.post('/submit-form', (req, res) => {
  let userinfo = req.body;
  console.log(userinfo);
  res.send('Submitted succesfully!');
});

app.listen(port);
