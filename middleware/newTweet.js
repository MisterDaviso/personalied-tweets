module.exports = (req,res,next) => {
    // Request contains UserID and Hashtag
    // Search Twitter for 10 tweets
    // For each tweet store them in the partition table using sequelize
    
    
    let values = (
        `${req.body.user_id},`,
        `${req.body.hashtag},`,
        `${req.body.association}`
        + `` 
    )
    sequelize.query(
        `INSERT INTO tweets VALUES (${values})`
    )
}