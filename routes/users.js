var express = require('express')
var router = express.Router()
var passport = require('passport')
// var path = require('path')
var LocalStrategy = require('passport-local').Strategy
// var multer = require('multer')
// var GridFsStorage = require('multer-gridfs-storage')
var User = require('../models/user')
var Ad = require('../models/user')

// var crypto = require('crypto')

//  var mongodbUri = 'mongodb:// hassan:hassan123@ds135952.mlab.com:35952/loginapp'
// var storage = new GridFsStorage({
//   url: 'mongodb:// localhost/loginapp',
//   //  url: mongodbUri,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err)
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname)
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         }
//         resolve(fileInfo)
//       })
//     })
//   }
// })
// const prop = multer({ storage })

// router.post('/prop', prop.single('file'), function (req, res) {
//   //  res.json({ file: req.file })
//   res.redirect('/users/prop')
// })

router.get('/register', function (req, res) {
  res.render('register')
})

// login route
router.get('/login', function (req, res) {
  res.render('login')
})

// login route
router.post('/register', function (req, res) {
  var name = req.body.name
  var email = req.body.email
  var username = req.body.username
  var password = req.body.password
  // var password2 = req.body.password2

  req.checkBody('name', 'Name is Required').notEmpty()
  req.checkBody('email', 'Email is Required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username is Required').notEmpty()
  req.checkBody('password', 'password is Required').notEmpty()
  req
    .checkBody('password2', 'Passwords does not match')
    .equals(req.body.password)

  var errors = req.validationErrors()
  if (errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    })
    User.createUser(newUser, function (err, user) {
      if (err) throw err
      console.log(user)
    })
    req.flash('success_msg', 'You are registered and can now login')
    res.redirect('/users/login')
  }
})

// submit ad
router.post('/prop/submit', function (req, res) {
  var adtitle = req.body.adtitle
  var category = req.body.category
  var txtarea = req.body.txtarea
  var name1 = req.body.name1
  var cell = req.body.cell
  var province = req.body.province

  req.checkBody('adtitle', 'Title is Required').notEmpty()
  req.checkBody('category', 'Category is Required').notEmpty()

  var errors = req.validationErrors()
  if (errors) {
    res.render('prop', {
      errors: errors
    })
  } else {
    var newAd = new Ad({
      adtitle: adtitle,
      category: category,
      txtarea: txtarea,
      name1: name1,
      cell: cell,
      province: province
    })
    Ad.createAd(newAd, function (err, ad) {
      if (err) throw err
      console.log(ad)
    })
    req.flash('success_msg', 'Your Ad has been successfully posted')
    res.redirect('/users/prop')
  }
})

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, { message: 'Unkown User' })
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'invalid Password' })
        }
      })
    })
  })
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  function (req, res) {
    res.redirect('/')
  }
)

router.get('/logout', function (req, res) {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

router.get('/prop', function (req, res) {
  res.render('prop')
})

// router.get('/search/:ser', function (req, res, next) {
//   var resultArray = []
//   const { ser } = req.params
//   mongo.connect(
//     url,
//     function (err, client) {
//       var db = client.db('loginapp')
//       assert.strictEqual(null, err)
//       var cursor = db.collection('ad').find({ adtitle: { $regex: 123 } })
//       cursor.forEach(
//         function (doc, err) {
//           if (err) throw err
//           resultArray.push(doc)
//           console.log(resultArray)
//         },

//         function () {
//           client.close()
//           //  res.json(data)
//           res.render('login', { items: resultArray })
//         }
//       )
//     }
//   )

//   //    const { ser } = req.params
//   //    console.log(req.params)
//   //  for (var i=0 i< )
//   //  ad.find(
//   //    {
//   //      adtitle: {
//   //        $regex: new RegExp(ser)
//   //      }
//   //    },
//   //    {
//   //      _id: 0,
//   //      __v: 0
//   //    },
//   //    function (err, data) {
//   //      res.json(data)
//   //    }
//   //  ).limit(10)
// })

//  router.findAll = (req, res) => {
//    users
//      .find()
//      .then(users => {
//        res.send(users)
//      })
//      .catch(err => {
//        res.status(500).send({
//          message: err.message
//        })
//      })
//  }

//  Connect to the db

//  router.get('/', function (req, res) {
//    User.findAll(function (req, res) {
//      req
//        .find()
//        .then(users => {
//          res.send(users)
//        })
//        .catch(err => {
//          res.status(500).send({ message: err.message })
//        })
//    })
//  })

module.exports = router
