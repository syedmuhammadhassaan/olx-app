var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var exhbrs = require('express-handlebars')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
// var multer = require('multer')
// var GridFsStorage = require('multer-gridfs-storage')
var Grid = require('gridfs-stream')
var methodOverride = require('method-override')
// var crypto = require('crypto')

// var bcrypt = require('bcryptjs')
// var localStrategy = require('passport-local').Strategy
// var mongo = require('mongodb')
var mongoose = require('mongoose')
mongoose.connect('mongodb:// localhost/loginapp')
var db = mongoose.connection

//  var publicPath = path.join(__dirname, '/public')

var routes = require('./routes/index')
var users = require('./routes/users')

// init app

var app = express()
let gfs

db.once('open', function () {
  gfs = Grid(db, mongoose.mongo)
  gfs.collection('uploads')
})

//  app.use(express.static('public'))
// multer storage

// view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exhbrs({ defaultLayout: 'layouts' }))
app.set('view engine', 'handlebars')

// middlewares
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Express session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  })
)
// passport
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']'
      }
      return { param: formParam, msg: msg, value: value }
    }
  })
)
// mongodb
app.use(function (req, res, next) {
  req.db = db
  next()
})

// connect flash
app.use(flash())

// Global vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

app.use('/', routes)
app.use('/users', users)
// set port
app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, '/')))
//  app.use('/', express.static(publicPath))
app.listen(app.get('port'), function () {
  console.log('server started on port' + app.get('port'))
})

//  function newfunction (formParam, msg, value) {
//    return
//    {
//      formParam, errorMessage
//      msg, givenValue
//      value
//    }
//  }
