/**************
 * NODE MODULES
***************/
// Important variables
var express = require("express")
var layouts = require("express-ejs-layouts")
var app = express()

/****************************
 * MIDDLEWARE AND/OR SETTINGS
 ****************************/
app.set("view engine", "ejs")
app.use(layouts)
app.use(express.static('static'))

/********
 * ROUTES
 ********/
app.get('/', (req,res) => {
    res.render('home')
})
// Wild card. Leave it for last.
 app.get('*', (req,res) => {
    res.render('error')
}) 

/**********************
 * SSSSSHHHHH... LISTEN
 **********************/
app.listen(3000, () => {
    console.log("ALRIGHT HERE WE GO")
})