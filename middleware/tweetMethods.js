// Required modules
require('dotenv')
const config = require('../config/config').production;
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, '', '', config)
var request = require('request')

// This is the object that will be exported
let tweetMethods = {
    addTweets: async (userId,hashtag) => {
        // req.body contains userID and hashtag
        console.log("Starting access request")
        await request({
            url: 'https://api.twitter.com/oauth2/token',
            method: 'POST',
            auth: {user:process.env.API_KEY, pass:process.env.API_SECRET},
            form: {'grant_type':'client_credentials'}
        }, async (err, response) => {
            if(err) {console.log(err); return;}
            var token = JSON.parse(response.body).access_token
            console.log("Starting tweet request")
            await request({
                url: `https://api.twitter.com/1.1/search/tweets.json?q=%23${hashtag}&count=5`, 
                headers: {'Authorization': 'Bearer ' + token}
            }, async (err, response, body) => {
                // Parse and store just the tweet data
                let tweets = JSON.parse(body).statuses
                console.log("Starting forEach loop")
                await tweets.forEach(async (tweet) => {
                    // Check if any tweets are stored at that location.
                    let check = await sequelize.query(`SELECT * FROM user${userId} WHERE tweet_id = '${tweet.id}' AND hashtag = '${hashtag}'`)
                    // If none are, enter the tweet into the table.
                    if(check[0].length === 0) {
                        // Write out all the values that are going to be inserted
                        let values = ""+
                            `'${userId}', ` + 
                            `'${hashtag}', ` +
                            'NULL, ' +
                            `${tweet.id_str}, `+
                            `'${tweet.user.screen_name}', ` +
                            `'https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}'`;
                        // Insert the data via sequelize query
                        sequelize.query(`INSERT INTO user${userId} VALUES (${values})`)
                    }
                })
                console.log("All the new tweets are added")
                return "done"
            })
        })
    },
    postTweets: async function(req,res,next) {
        let token = this.getAccessKey()
        request({
            url: `https://api.twitter.com/1.1/search/tweets.json?q=%23${req.body.hashtag}&count=50`, 
            headers: {'Authorization': 'Bearer ' + token}
        }, async (err, response, body) => {
            // Parse and store just the tweet data
            let tweets = JSON.parse(body).statuses
            
            await tweets.forEach(async (tweet) => {
                // Check if any tweets are stored at that location.
                let check = await sequelize.query(`SELECT * FROM user${req.body.userId} WHERE tweet_id = ${tweet.id} AND hashtag =${req.body.hashtag}`)
                // If none are, enter the tweet into the table.
                if( check[0] === []) {
                    // Write out all the values that are going to be inserted
                    let values = ""+
                        `'${req.body.userId}', ` + 
                        `'${req.body.hashtag}', ` +
                        'NULL, ' +
                        `'${tweet.id}', `+
                        `'${tweet.user.screen_name}', ` +
                        `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id}`;
                    // Insert the data via sequelize query    
                    await sequelize.query(`INSERT INTO user${req.body.userId} VALUES (${values})`)
                }
            })
            next()
        })
    },
    getAccessKey: async function() {
        // req.body contains userID and hashtag
        var token
        await request({
            url: 'https://api.twitter.com/oauth2/token',
            method: 'POST',
            auth: {user:process.env.API_KEY, pass:process.env.API_SECRET},
            form: {'grant_type':'client_credentials'}
        }, (err, response) => {
            if(err) {console.log(err); return;}
            token = JSON.parse(response.body).access_token
        })
        return token
    },
    createTweetTable: () => {
        sequelize.query(
            "CREATE TABLE tweets " +
                "(user_id int not null, " +
                "hashtag text, " +
                "association text, " +
                "tweet_id text, " +
                "user_screen_name text, " +
                "tweet_url text) " +
            "PARTITION BY LIST (user_id)"
        )
    },
    getAllPartitions: () => {
        sequelize.query(
            "SELECT table_name",
                "FROM information_schema.tables",
                "WHERE table_schema='public'",
                "AND table_type='BASE TABLE'"
            + ""
        )
    },
    createPartitions: (userId) => {
        sequelize.query(
            `CREATE TABLE user${userId}`,
            `PARTITION OF tweets`,
            `FOR VALUES IN (${userId})`
        )
    },
    getUnsortedTweets: async ([userId, hashtag]) => {
        let result = await sequelize.query(`SELECT * FROM user${userId} ` +
            `WHERE hashtag = '${hashtag}' ` +
            `AND association IS NULL`
        )
        console.log("The result of the query:",result[0])
        return result[0]
    },
    hasUnsorted: async ([userId, hashtag]) => {
        let unassociated = await sequelize.query(`SELECT * FROM user${userId} ` +
            `WHERE hashtag = '${hashtag}' ` +
            `AND association IS NULL`
        )
        console.log("Unassociated tweets:",unassociated[0])
        if (unassociated[0].length === 0) return false
        else return true
    },
    getSortedTweets: ([userId,hashtag]) => {

    },
    getUserHashtags: async (userId) => {
        let hashtagData = await sequelize.query(`SELECT DISTINCT hashtag FROM user${userId}`)
        return hashtagData[0]
    },
    setAssociation: (userId,hashtag,association) => {
        sequelize.query(`UPDATE user${userId} SET association = '${association}' WHERE user_id = ${userId} AND hashtag = '${hashtag}'`)
    }
}

module.exports = tweetMethods