// WHAT IS REQUIRED OF THIS CONTROLLER?
let router = require('express').Router()
let moment = require('moment')
let adminLogin = require('../middleware/adminLogin')
let userLogin = require('../middleware/userLogin')
let tweetMethods = require('../middleware/tweetMethods')
let db = require('../models')

// Ensure only those that are logged in may continue.
router.use(userLogin)

// GET the user's profile and pass in all the unique hashtags the user has started sorting
router.get('/user', async (req,res) => {
    // Retrieve all the user's unique hashtag selections
    let hashtagData = await tweetMethods.getUserHashtags(req.user.id), hashtags = [];
    if(hashtagData != undefined) {
        hashtagData.forEach(hashtag => {
            hashtags.push(hashtag.hashtag)
        })
    }
    res.render('profile/user', {moment, hashtags})
})

// View another user's profile as a guest
router.get('/guest/:id', (req,res) => {
    db.user.findByPk(req.params.id)
    .then(userProfile => {
        res.render('profile/guest', {moment, userProfile})
    })
})

// Log in as an admin.
router.get('/admin', adminLogin, (req,res) => {
    res.render('profile/admin', {moment})
})

// Export the router so that it can be used.
module.exports = router