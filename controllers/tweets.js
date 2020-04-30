/**
 * Okay, this is going to get weird.
 * Step 1: Get twitter information from given hashtag
 * Step 2: Display information in visually pleasing way
 * Step 3: Allow seamless transition to new tweets
 * Step 4: 
 */

// WHAT IS REQUIRED OF THIS CONTROLLER?
let router = require('express').Router()
let db = require('../models')
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
// POST a new hashtag to the user's partition with a few tweets assigned to it
router.post('/new/:hash', (req,res) => {

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