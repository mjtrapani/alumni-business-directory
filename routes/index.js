var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Alumni Business Directory' });
});

/* GET alumni office manager page. */
router.get('/aomp', function(req, res, next) {
  res.render('aomp', { title: 'Alumni Office Manager Listing Verification Page' });
});

module.exports = router;
