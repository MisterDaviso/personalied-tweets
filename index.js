// Important variables
var express = require("express")
var layouts = require("express-ejs-layouts")
var app = express()

// Make useful the things you brought in
app.set("view engine", "ejs")
app.use(layouts)
app.use(express.static('static'))

// Routes
app.get('*', (req,res) => {
    res.render('error')
}) 

// LISTEN FOR THE PORT
app.listen(3000, () => {
    console.log("ALRIGHT HERE WE GO")
})