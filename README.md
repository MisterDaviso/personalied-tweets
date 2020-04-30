# Project 2

## Requirements
- Have at least 2 models
- Include Signup/Login functionality
- Incorporate at least 1 api
- Have complete RESTful routes (GET, POST, PUT, DELETE)
- Utilize an ORM (sequelize)
- Include a readme that explains how to use it
- Semantically clean code
- Be deployed online

## Ideas
- 5e Spell Index
    - Allow users to create new spells
    - Add an upvote and comment system to each spell
    - Add option to filter by search
    - Add options to sort by level, class, school, etc.
- Storywriting tools
    - One section tracks actual written chapters
    - One section tracks important characters and story arcs
        - Add visualization tool for character arcs
    - One section tracks setting, history, and locations
**WINNER**
- Machine Learning Data Collection via Twitter
    - Filter through images of certain hashtags and save images that accurately represent that hashtag, with the intent of later filtering the data through a machine learning algorithm to have it recognize valid posts of that hashtag

## User Experience
- User arrives on the home page
    - Detailed explanation of app's purpose and how to use it
    - Large links to Sign Up or Log In
- New User is presented with a Sign Up page
    - Enters a username, email, and must enter password twice to confirm new profile
    - Create a unique db for the user
        - Link and/or write a BASH file to run on profile creation
        - Do it without restarting the server
    - Store user log-in data and reference to their db in the general Users db
- User Profile Page
    - User clicks a button to start tracking data for a new Hashtag and provides input
    - On creation, a new box is created on profile showing hashtag and entries stored
        - Creates a box for each unique hashtag entry
    - Clicking on a box brings user to sort screen
- Sort Screen
    - Tweet data is fetched and formatted to be readable for the user
        - Parse some condition to check if the tweet's data is already stored
    - User has three options: Positive, Neutral, and Negative association
        - Pushing one stores the tweet's data with that association
    - New tweet is presented and repeat
- Navigation/Options
    - Navigation is provided for "Login || Signup || Home Page"
    - After logged in, navs replaced with "Welcome [USERNAME]! || Profile || Sign out || Home Page"

## Process
* To do:
    - Tweet Data processing
        - Send requests for tweet data according to a hashtag until a new tweet appears
            - If possible, send filters through the request and retrieve 5 unique at a time
            - Do this request twice to have 10 tweets prepared to display, and retrieve another 5 whenever 5 tweets have been sorted
        - Display tweet data for the user to see
        - Add a form with tweet data and three types of submits that pass different data - Positive, Negative, and Neutral - and push the data to the User's database
        - If possible, do not refresh page and instead transition to next tweet in the chain
            - Otherwise, refresh page with new request for a unique tweet
    - User Profile Creation
        - Send information to users table: firstname, lastname, email, password, username, birthdate, etc.
        - Run BASH script to create a model named after the user's uniqe ID in the user's table: hashtag, association, unique-tweet-id, [TWEET DATA], etc.
    - User Profile Page
        - Show user information
        - Add options to edit user information
        - Show a clickable box for each unique hashtag the user has collected data on: Hashtag, 
            - Total tweets sorted written as a form to a GET route containing hidden data for the user's ID and the hashtag info
            - Individual statistics for each association written as forms to the same GET route as the total, containing hidden data for userId and hashtag, but one more for association
            - Button linked to GET route to display sort page 
            - Button linked to DELETE route to remove hashtag data from database with security measure overlay to ensure this was not accidental
        - Button that brings up an overlay to input a new hashtag to sort through
            - Submitting this form refreshes the page to display the new box
    - Sorted tweets
        - Write a GET route that takes in userId, hashtag and association to get data from that user's model.
            - If the association is NULL, treat it as requesting all three, or perhaps as removing that condition from the database request
        - Rows of three by three displaying the tweets in a smaller size than

## Techniques
- Creating a new model:
    - Write a BASH file to copy a template model, rename it, and migrate it. The template will have the association to User already written.

## Technologies
- Basics
    - Express, EJS, EJS-layouts
- BASH Scripts Reading/Writing
    - Looks like Node has a built in "child_process" module. Should look into this more.
    ```js
    var exec = require('child_process').exec;

    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec("ls -la", function(error, stdout, stderr) {
        if (!error) {}// things worked!
        else {}// things failed :(
    });
    ```

