/**
 * Okay, this is going to get weird.
 */

// WHAT IS REQUIRED OF THIS CONTROLLER?
require('dotenv')
let router = require('express').Router()
let db = require('../models')
const config = require('../config/config')[process.env.CONFIG_OBJECT];
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, '', '', config)
var request = require('request')
// Tweet and Sequelize functions
var tweetMethods = require('../middleware/tweetMethods')
// Only let users access and use these pages
let userLogin = require('../middleware/userLogin')
router.use(userLogin)

/**
 * ROUTES
 */
// GET the screen for sorting. version 2
router.get('/sort/:hashtag', async (req,res) => {
    let token,
        userId = req.user.id, 
        hashtag = req.params.hashtag;
    let hashtagData = await sequelize.query(`SELECT * FROM user${userId} WHERE hashtag = '${hashtag}' AND association IS NULL`);
    console.log("Hashtag:",hashtag)
    console.log("Beginning of the GET, data is:", hashtagData[0])
    if(hashtagData[0].length === 0) {
        console.log("So the array of data is empty...")
        request({
            url: 'https://api.twitter.com/oauth2/token',
            method: 'POST',
            auth: {user:process.env.API_KEY, pass:process.env.API_SECRET},
            form: {'grant_type':'client_credentials'}
        }, (err, response) => {
            if(err) {console.log("Error occured when gaining access"); return;}
            console.log("We got the token...")
            token = JSON.parse(response.body).access_token
            request({
                url: `https://api.twitter.com/1.1/search/tweets.json?q=%23${hashtag}&count=15`, 
                headers: {'Authorization': 'Bearer ' + token}
            }, async (err, response, body) => {
                if(err) {console.log("Error occured when retrieving tweets");return;}
                // Parse and store just the tweet data
                console.log("Requests for tweets went through...")
                let tweets = JSON.parse(body).statuses
                for (var i=0; i<tweets.length; i++) {
                    let values = ""+
                        `'${userId}', ` + 
                        `'${hashtag}', ` +
                        'NULL, ' +
                        `${tweets[i].id_str}, `+
                        `'${tweets[i].user.screen_name}', ` +
                        `'https://twitter.com/${tweets[i].user.screen_name}/status/${tweets[i].id_str}'`;
                    let query = `INSERT INTO user${userId} SELECT ${values} WHERE NOT EXISTS (SELECT * FROM user${userId} WHERE hashtag = '${hashtag}' AND tweet_id = '${tweets[i].id_str}')`
                    await sequelize.query(query)
                }
                // Continue functionality
                hashtagData = await sequelize.query(`SELECT * FROM user${userId} WHERE hashtag = '${hashtag}' AND association IS NULL`)
                if(hashtagData[0].length === 0 || hashtagData[0] === undefined) {
                    console.log("Still no unsorted tweets. This is wack.")
                    // If the query doesn't return anything new, 
                    // let the user know they should come back later
                    req.flash('error', "You've gone through a lot of tweets. Maybe take a break.")
                    res.redirect('/profile/user')
                } else {
                    hashtagData = hashtagData[0]
                    let tweet = hashtagData[0]
                    console.log("Tweet:", tweet)
                    res.render('tweets/sort', {tweet})
                }
            })
        })
        
    } else {
        hashtagData = hashtagData[0]
        let tweet = hashtagData[0]
        console.log("Tweet:", tweet)
        res.render('tweets/sort', {tweet})
    }
})

// POST a new hashtag to the user's table
router.post('/new', async (req,res) => {
    console.log("Posting new hashtag...",req.user.id,req.body.hashtag)
    await tweetMethods.addTweets([req.user.id,req.body.hashtag])
    console.log("Redirecting to user profile...")
    res.redirect('/profile/user')
})
// PUT the association inside of the current tweet
router.put('/associate', async (req,res) => {
    console.log("Setting association: " + req.body.hashtag + " as " + req.body.associate)
    await sequelize.query(`UPDATE user${req.user.id} SET association = '${req.body.associate}' WHERE tweet_id = '${req.body.tweetId}' AND hashtag = '${req.body.hashtag}'`)
    res.redirect(`/tweets/sort/${req.body.hashtag}`)
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

/** 
 * HELPER FUNCTIONS
 */