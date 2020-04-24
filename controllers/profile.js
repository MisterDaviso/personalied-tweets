// WHAT IS REQUIRED OF THIS CONTROLLER?
let router = require('express').Router()
let moment = require('moment')
let adminLogin = require('../middleware/adminLogin')
let userLogin = require('../middleware/userLogin')
let db = require('../models')

router.use(userLogin)

router.get('/user', (req,res) => {
    res.render('profile/user', {moment})
})

router.get('/guest/:id', (req,res) => {
    db.user.findByPk(req.params.id)
    .then(userProfile => {
        res.render('profile/guest', {moment, userProfile})
    })
})

router.get('/admin', adminLogin, (req,res) => {
    res.render('profile/admin', {moment})
})

module.exports = router