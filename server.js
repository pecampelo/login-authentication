// Run on nodemon.

// Environment Variables that can be stored and
// loaded into the server
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// imports
const express = require('express')
const app = express() // App
const bcrypt = require('bcrypt') // Hash and compare passwords
const passport = require('passport') // Authentication Library
const session = require('express-session') // Store & Persist user access
const flash = require('express-flash') // authentication failure
const methodOverride = require('method-override')

// port
const port = 3000
const users = []

// passport authentication
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// express configuration
app.set('view-engine', 'ejs') // telling the server what language we are using.
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

////// Route Methods
// Index
app.get('/', checkAuthenticated, (req, res) => {
  res.render( 'index.ejs' , { name: req.user.name })
})

// Login Page
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// Register Page
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
    console.log(users)
})

// Delete Posted Variables and Redirect
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

// Protecting Route Access through authentication as a middleware function
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // everything works, move on
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next() // everything works, move on
}

//
app.listen(port, () => console.log(`Pete API listening on port ${port}`))
