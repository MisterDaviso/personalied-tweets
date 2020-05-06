# Personalized Tweets!

## Technologies Used

## Models Used
**User Model**
| Column | Type | Notes |
| id | Integer |Serial Primary Key|
| firstname | String | Length > 1 |
| lastname | String | |
| email | String | Valid Address |
| username | String | |
| password | String | Length >= 8 |
| admin | Boolean | Default False |
| birthday| Date | |
| zipcode | Integer | |
| bio | Text | |
| picture | string | Valid URL |
| createdAt | date | |
| updatedAt | date | |

**Tweet Data Model**
| Column | Type | Notes |
| user_id | integer | |
| hashtag | string | |
| association | string | |
| tweet_id | string | Stored as String to preserve memory |
| user_screen_name | string | |
| tweet_url | string | |

## How to Use

### 1. Signup/Login
By far the easiest step in this process. It should be relatively self-explanatory. However, on the backend a partition of the tweet data table will be created associated with that specific user.

### 2. Add a new hashtag to search for
At the bottom of the user's page there is a button to add a new hashtag to start sorting tweets for. clicking this button brings up a modal to type in whatever hashtag you wish to sort and a button to submit. This will automatically populate the table with a few tweets. At the bottom of the user's page should now be a button that allows the user to begin sorting.

### 3. Sort through the tweets
Clicking the "sort" button of a desired hashtag will redirect the user to a page and display a tweet as well as three radio buttons and a submit button to create an association with that tweet. Upoon submittal, the request is sent off to update that tweet's association attribute and the page is refreshed with a new tweet.

## Known issues

### User Experience
1. After submitting the form to sort a new hashtag, they must then refresh their page to be able to see it at the bottom of their profile page, even though though the page seemingly refreshes upon submittal. This is a result of some bad code that I will go into later.
2. The state of the hashtag boxes is currently the epitome of 'minimum'.
3. The current system pulls tweets by a combination of most recent and most popular. However, as a result if the user sorts tweets too fast they may run out of everything that can be sorted at that time, so the user will be re-directed back to their profile page in this instance. Future updates would allow for a wider array of tweets to be collected and reduce the number of these cases.

### State of the Code
1. The nature of Oauth2 and Partitioned Tables complicated matters immensely. There are numerous async function calls throughout both the tweets.js controller and the tweetMethods.js middleware. This complexity overwhelmed me with the timetable I had upon creating this project and as aresult those two files became very messy with a lot of repeated code.

### Untested Cases
1. Multi-word hashtags have not been tested to be functional

### Future Development
1. Migrate all query and request functionality from tweets.js to tweetMethods.js without sacrificing functionality
2. Clean up the hashtag cards on the user's profile page and add statistics to each
3. Allow the user to see all tweets they have sorted and allow them to change their association if desired