// Modules / Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')

// Create New Express App
var app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.get('*', function(req, res) {
    res.send("Sorry, page not found.");
});

// App listens on port
app.listen(8080, function() {
    console.log('Listening on port localhost:8080...');
});