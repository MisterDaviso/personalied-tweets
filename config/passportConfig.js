// Require environment variables
require('dotenv').config()
// Require node modules
let passport = require('passport')
// Require any Strategies (types of Auth) we want to see
let LocalStrategy = require('passport-local').Strategy
// Import database reference
let db = require('../models')

// Serialization and DeSerialization functions
// These are for passport to use in order to store/lookup the user info
// SERIALIZE: Reduce a user object to just its id field
passport.serializeUser((user, done) => {
    // Call the callback function with the user id as an arugment
    // done(error, id) - pass null if no error
    done(null, user.id)
})
// DESERIALIZE: Take the user id and return the user object
passport.deserializeUser((id, done) => {
    db.user.findByPk(id)
    .then(user => {done(null,user)})
    .catch(err => {done})
})

// LOCAL STRATEGY: Using a database that we manage ourselves (not OAuth)
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email,password,done) => {
    db.user.findOne({where: {email: email}})
    .then(foundUser => {
        // Check if there is a user; if so, check the password.
        if(foundUser && foundUser.validPassword(password)) {
            done(null, foundUser)
        } else {
            done(null, null)
        }
    })
    .catch(done)
}))

module.exports = passport