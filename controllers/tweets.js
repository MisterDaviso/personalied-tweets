/**
 * Okay, this is going to get weird.
 */

// WHAT IS REQUIRED OF THIS CONTROLLER?
require('dotenv')
let router = require('express').Router()
let db = require('../models')
var request = require('request')
// Tweet and Sequelize functions
var tweetMethods = require('../middleware/tweetMethods')
var addTweets = tweetMethods.addTweets
// Only let users access and use these pages
let userLogin = require('../middleware/userLogin')
router.use(userLogin)

/**
 * ROUTES
 */
// GET the screen for the user to assign associations
router.get('/sort/:hashtag', async (req,res) => {
    // Sort through the the user's table for unassigned tweets of provided hashtag
    // Create variables to hold the tweets and params for queries
    let unsortedTweets, 
        userId = req.user.id, 
        hashtag = req.params.hashtag, 
        params = [userId,hashtag];
    console.log("The parameters to send:", params)
    // If there are tweets that have yet to be sorted, store them..
    if(await tweetMethods.hashtagHasUnsorted(params)) {
        console.log("You got some unsorted tweets. Awesome!")
        unsortedTweets = await tweetMethods.getUnsortedTweets(params)
    }
    else {
        console.log("All tweets are currently sorted")
        // If all the currently stored tweets are sorted, add more to the table
        await router.use(addTweets)
        // Check to see if there are any new tweets
        if(await tweetMethods.hashtagHasUnsorted(params)) {
            // If there are new tweets, sort away!
            unsortedTweets = await tweetMethods.getUnsorted(params)
        } else {
            // If the query doesn't return anything new, 
            // let the user know they should come back later
            req.flash('error', "You've gone through a lot of tweets. Maybe take a break.")
            res.redirect('/profile/user')
        }
    }
    // Pull the URL's that will be used on sorting page
    console.log("All unsorted tweets:", unsortedTweets)
    let urls = unsortedTweets.map(tweet => {return tweet.tweet_url})
    res.render('tweets/sort', {hashtag, url:urls[0]})
})
// POST a new hashtag to the user's table
router.post('/new', async (req,res) => {
    console.log("Posting new hashtag...")
    await addTweets(req.user.id,req.body.hashtag)
    console.log("Redirecting to user profile...")
    res.redirect('/profile/user')
})
// PUT the association inside of the current tweet
router.put('/associate', async (req,res) => {
    await tweetMethods.setAssociation(req.user.id,req.body.hashtag,req.body.association)
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
let moreTweets = async () => {

}