var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    name: {
      type: String
    }
  },
  { collection: 'users' }
)
var User = (module.exports = mongoose.model('User', UserSchema))

var adSchema = mongoose.Schema(
  {
    adtitle: { type: String, index: true },
    category: {
      type: String
    },
    txtarea: {
      type: String
    },
    name1: {
      type: String
    },
    cell: {
      type: String
    },
    province: {
      type: String
    }
  } // { collection: 'ad' }
)

var Ad = (module.exports = mongoose.model('ad', adSchema))

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash
      newUser.save(callback)
      if (err) throw err
      //  Store hash in your password DB.
    })
    if (err) throw err
  })
}

module.exports.getUserByUsername = function (username, callback) {
  var query = { username: username }
  User.findOne(query, callback)
}

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
module.exports.createAd = function (newAd, callback) {
  newAd.save(callback)
  console.log(Ad)
}

//  module.exports.findAll = function (username, callback) {
//    var query = { username: username }
//    User.findAll(query, callback)
//  }
//  exports.findAll = (req, res) => {
//    console.log('Fetch all Users')

//    User.find()
//      .then(users => {
//        res.send(users)
//      })
//      .catch(err => {
//        res.status(500).send({
//          message: err.message
//        })
//      })
//  }
