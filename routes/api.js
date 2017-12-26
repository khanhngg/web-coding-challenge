// Dependencies
var express = require('express');
var router = express.Router();

// Routes
router.get('/', function(req, res) {
    console.log('GET /api');
    res.render('pages/index');
});

// Return router
module.exports = router;