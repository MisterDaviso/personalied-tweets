/**************
 * NODE MODULES
***************/
// Important variables
require('dotenv').config()
var express = require("express")
var flash = require('connect-flash')
var layouts = require("express-ejs-layouts")
var session = require('express-session')
var passport = require('passport')

// Create the app
var app = express()

/****************************
 * MIDDLEWARE AND/OR SETTINGS
 ****************************/
app.set("view engine", "ejs")
app.use(layouts)
app.use(express.static('static'))
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret:  process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next) => {
    res.locals.alerts = req.flash()
    res.locals.user = req.user
    next()
})

/********
 * ROUTES
 ********/
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/tweets', require('./controllers/tweets'))

app.get('/', (req,res) => {
    res.render('home')
})
app.get('/test',(req,res) => {
    res.render('tweets/sort')
})
// Wild card. Leave it for last.
app.get('*', (req,res) => {
    res.render('error')
}) 

/**********************
 * SSSSSHHHHH... LISTEN
 **********************/
app.listen(process.env.PORT || 3000, () => {
    console.log("ALRIGHT HERE WE GO")
})

// firstname lastname email password bio picture zipcode birthday username
