module.exports = (req,res,next) => {
    // ARE YOU USER?
    if(req.user) {
        next() // Go right ahead.
    } else {
        req.flash('error', 'ONLY LOGGED IN MAY ENTER.')
        res.redirect('/auth/login')
    }
}