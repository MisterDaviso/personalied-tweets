// Node Modules/Variables
let router = require('express').Router()
let db = require('../models')
let passport = require('../config/passportConfig')
// Sequelize
const config = require('../config/config')[process.env.CONFIG_OBJECT];
const Sequelize = require('sequelize')
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
// GET the signup screen
router.get('/signup', (req, res) => {
    res.render('auth/signup', {data: {}})
})
// POST a new user to the database
router.post('/signup', (req,res,next) => {
    console.log('REQUEST BODY', req.body)
    // If the passwords entered do not match
    if(req.body.password !== req.body.password_verify) {
        // Let the user know what they did wrong
        req.flash('error', 'Passwords do not match')
        // Put them back on the singup page so that they can DO IT AGAIN
        res.render('auth/signup', { data: req.body, alerts: req.flash() })
    // If the passwords matched, move on ahead.
    } else {
        // Create a new User unless someone else already claimed that email
        db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: req.body
        })
        .then(async ([user, wasCreated]) => {
            // If a new user was created, follow the necessary procedures.
            if(wasCreated) {
                // Create a partition for the user
                await sequelize.query(`CREATE TABLE user${user.id} PARTITION OF tweets FOR VALUES IN (${user.id})`)
                // AUTO-LOGIN with their password
                passport.authenticate('local', {
                    successRedirect: '/profile/user',
                    failureRedirect: '/auth/login'
                })(req,res,next)
            }
            // If someone already had that email, let this person know.
            else {
                // Say something snarky but leighthearted
                req.flash('error', 'You already made an account, ya dingus')
                // Take them to the login page, since they already have a profile
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

// Log the current user out
router.get('/logout', (req,res) => {
    // Remove user data from the session
    req.logout()
    req.flash('success', 'We await your return.')
    res.redirect('/')
})

// Export (allow me to include this in another file)
module.exports = router
