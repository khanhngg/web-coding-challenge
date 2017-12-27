// Dependencies
var express = require('express');
var router = express.Router();
// var request = require('request');
var request = require('request-promise');

// GitHub User API URL
var ghApiUrl = 'https://api.github.com/users/';

// Routes
router.post('/', function(req, res) {
    // Debugging
    console.log('POST /search');

    // Get the username value from input field
    var username = req.body.username;

    processUserRequest(username).then(function(user) {
        // result = JSON.parse(result);
        console.log("IN processUserRequest: user = \n" + JSON.stringify(user, null, 4));

        processFollowersRequest(username).then(function (followers) {
            console.log("IN processFollowersRequest: followers = \n" + JSON.stringify(followers, null, 4));            

            // Render view using result
            res.render('pages/index', {
                user: user,
                followers: followers
            }); 

        });



    });

});

// Process the request promises and return github api result
function processUserRequest(username) {
    github.username = username;
    return github.getUser();
}

function processFollowersRequest(username) {
    github.username = username;
    return github.getUser()
        .then(github.getFollowersUrl)
        .then(github.getFollowers);
}

// GitHub Object
var github = {
    // Username from the input field
    username: null,

    // Params for gh api request
    url: ghApiUrl,
    headers: {'User-Agent': 'khanhngg'},

    // Returns a user as a reponse from GET request to gh api 
    getUser: function() {
        return request({
            method: 'GET',
            json: true,
            uri: github.url + github.username,
            headers: github.headers
        });
    }, 

    getFollowersUrl: function(user) {
        return user.followers_url;
    },

    getFollowers: function(uri, followers) {
        return request({
            method: 'GET',
            json: true,
            uri: uri,
            resolveWithFullResponse: true,
            headers: github.headers
        }).then(function (response) {
            if (!followers) { // if followers didn't get passed, initialize new list of followers
                followers = [];
            }

            followers = followers.concat(response.body);
            console.log("Current user has " + followers.length + " followers so far");

            // console.log("IN getFollowers.then -> response = \n" + JSON.stringify(response, null, 4));

            if (response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) }).length > 0) {
                console.log("There is more.");
                var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) })[0])[1];
                return github.getFollowers(next, followers);
            }

            return followers;
        });
    },

};

// Return router
module.exports = router;