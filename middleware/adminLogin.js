module.exports = (req,res,next) => {
    // ARE YOU USER?
    if(req.user.admin) {
        next() // Go right ahead.
    } else {
        req.flash('error', 'YOU HAVE NOT THE PERMISSIONS TO ENTER HERE.')
        res.redirect('/profile/user')
    }
}