// Node Modules/Variables
let router = require('express').Router()
let db = require('../models')
let passport = require('../config/passportConfig')

/**
 * ROUTES
 */
// GET the login screen
router.get('/login', (req, res) => {
    res.render('auth/login')
})

// POST /auth/login - this is a place for the login form to post to
router.post('/login', passport.authenticate('local', {
    successFlash: 'Successful Login! YOU HAVE RETURNED TO US!',
    successRedirect: '/profile/user',
    failureFlash: "Are you sure you are who you say you are?",
    failureRedirect: '/auth/login'
}))
// GET the signup scree
router.get('/signup', (req, res) => {
    res.render('auth/signup', {data: {}})
})
// POST a new user to the database
router.post('/signup', (req,res,next) => {
    console.log('REQUEST BODY', req.body)
    if(req.body.password !== req.body.password_verify) {
        // Let the user know stuff is broken
        req.flash('error', 'Passwords do not match')
        // Put them back on the page so that they can DO IT AGAIN
        res.render('auth/signup', { data: req.body, alerts: req.flash() })
    } else {
        db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: req.body
        })
        .then(([user, wasCreated]) => {
            if(wasCreated) {
                // AUTO-LOGIN withpassword
                passport.authenticate('local', {
                    successFlash: 'Successful Login! YOU HAVE RETURNED TO US!',
                    successRedirect: '/profile/user',
                    failureFlash: "Are you sure you are who you say you are?",
                    failureRedirect: '/auth/login'
                })(req,res,next)
            }
            else {
                req.flash('error', 'You already made an account, ya dingus')
                res.redirect('/auth/login')
            }
        })
        .catch(err => {
            // Print error in terminal
            console.log('Error creating a user', err)
            // Check for validation error and let the user know if it is
            if(err.errors) {
                err.errors.forEach(e => {
                    req.flash('error', e.message)
                })
            } else {
                req.flash('error', 'SERVER ERROR MAN')
            }
            res.redirect('/auth/signup')
        })
    }
})

router.get('/logout', (req,res) => {
    // Remove user data from the session
    req.logout()
    req.flash('success', 'We await your return.')
    res.redirect('/')
})

// Export (allow me to include this in another page)
module.exports = router
