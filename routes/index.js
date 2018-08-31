var express = require("express");
var router = express.Router();
var mongo = require("mongodb");
var url = "mongodb://localhost";
var assert = require("assert");

router.get("/", ensureAuthenticated, function(req, res) {
  res.render("index");
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error-msg','You are not logged in');
    res.redirect("/users/login");
  }
}

router.get("/users/login", function(req, res, next) {
  var resultArray = [];
  mongo.connect(
    url,
    function(err, client) {
      var db = client.db("loginapp");
      assert.equal(null, err);

      var cursor = db.collection("ad").find();
      cursor.forEach(
        function(doc, err) {
          resultArray.push(doc);
          // console.log(doc);
        },
        function() {
          client.close();
          res.render("login", { items: resultArray });
        }
      );
    }
  );
});

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   /*Return only the documents where the address starts with an "S":*/
//   var query = { address: /^S/ };
//   dbo.collection("customers").find(query).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });

module.exports = router;
