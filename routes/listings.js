var express = require('express');
var router = express.Router();

/* GET businesslist. */
router.get('/businesslist', function(req, res) {
  var db = req.db;


  // var collection = db.get('businesslist');
  // collection.find({},{},function(e,docs){
  //   res.json(docs);
  // });
});

/* POST to addlisting. */
router.post('/addlisting', function(req, res) {
  var db = req.db;


  // var collection = db.get('businesslist');
  // collection.insert(req.body, function(err, result){
  //   res.send(
  //     (err === null) ? { msg: '' } : { msg: err }
  //   );
  // });
});

/* DELETE to deletelisting. */
router.delete('/deletelisting/:id', function(req, res) {
  var db = req.db;

  
  // var collection = db.get('businesslist');
  // var listingToDelete = req.params.id;
  // collection.remove({ '_id' : listingToDelete }, function(err) {
  //   res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  // });
});

module.exports = router;
