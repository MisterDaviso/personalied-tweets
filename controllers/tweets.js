/**
 * Okay, this is going to get weird.
 * Step 1: Get twitter information from given hashtag
 * Step 2: Display information in visually pleasing way
 * Step 3: Allow seamless transition to new tweets
 * Step 4: 
 */

// WHAT IS REQUIRED OF THIS CONTROLLER?
require('dotenv')
let router = require('express').Router()
let db = require('../models')
var request = require('request')
// These are needed for database manipulation
const config = require('../config/config').development;
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, '', '', config)
// Only let users access and use these pages
let userLogin = require('../middleware/userLogin')
router.use(userLogin)

/**
 * ROUTES
 */
// POST tweets of provided hashtag to the user's table
router.post('/new', (req,res) => {
    // req.body contains userID and hashtag
    request({
        url: 'https://api.twitter.com/oauth2/token',
        method: 'POST',
        auth: {user:process.env.API_KEY, pass:process.env.API_SECRET},
        form: {'grant_type':'client_credentials'}
    }, (err, res) => {
        if(err) {console.log(err); return;}
        var token = JSON.parse(res.body).access_token
        request({
            url: `https://api.twitter.com/1.1/search/tweets.json?q=%23${req.body.hashtag}&count=50`, 
            headers: {'Authorization': 'Bearer ' + token}
        }, (err, response, body) => {
            let json = JSON.parse(body)
            let tweets = json.statuses
            tweets.forEach(tweet => {
                let values = ""+
                    `${req.body.userId},`,
                    `${req.body.hashtag},`,
                    'NULL,',
                    `${tweet.id},`,
                    `${tweet.user.screen_name},`,
                    `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id}`;
            })
        })
    })
    // Redirect back to the user's profile
    res.redirect('/profile/user')
})
// GET the screen for the user to assign associations
router.get('/sort/:hash', (req,res) => {
    // Sort through the the user's table for unassigned tweets of provided hashtag
        // User ID will be sent in the body, not the param
    
    // If there are no unassigned tweets, add more to their table

})
// GET the tweets already sorted by the user by the provided hashtag
router.get('/:hash', (req,res) => {
    
})
// DELETE all tweets of associated hashtag from the user's table
router.delete('/:hash', (req,res) => {

})
// GET the error page because something went wack
router.get('*', (req,res) => {
    res.render('error')
})

module.exports = router