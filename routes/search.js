// Dependencies
var express = require('express');
var router = express.Router();
// var request = require('request');
var request = require('request-promise');

// GitHub User API URL
var ghApiUrl = 'https://api.github.com/users/';

// Routes
// POST: find new user
router.post('/', function(req, res) {
    // Debugging
    console.log('POST / in search');

    // Get the username value from input field
    var username = req.body.username;

    // Max followers per page
    let followersPerPage = 30;
    let currentPage = 1;

    processUserRequest(process.argv[2], username).then(function(user) {
        processFollowersRequest(user, currentPage).then(function (followers) {
            // Total number of followers
            let numberOfFollowers = followers.length;

            // Position of first and last followers in current page
            let firstFollowerIndex = 0;
            let lastFollowerIndex = (firstFollowerIndex + followersPerPage ==  numberOfFollowers) ? numberOfFollowers - 1 : firstFollowerIndex + followersPerPage - 1;

            // Render view using result
            res.render('pages/index', {
                user: user,
                followers: followers,
                previousSearchUser: username,
                currentPage: currentPage,
                numberOfPages: Math.ceil(numberOfFollowers / followersPerPage),
                firstFollowerIndex: firstFollowerIndex,
                lastFollowerIndex: lastFollowerIndex,
            }); 
        });



    });

});

// GET: find followers of user from page
router.get('/:username/:page', function(req, res) {
    // Debugging
    console.log('GET /search/:username='+ req.params.username + '/:page=' + req.params.page);

    // Get the username value from url params
    var username = req.params.username;

    // Max followers per page
    let followersPerPage = 30;
    let currentPage = req.params.page || 1;

    processUserRequest(process.argv[2], username).then(function(user) {
        // result = JSON.parse(result);
        // console.log("IN processUserRequest: user = \n" + JSON.stringify(user, null, 4));

        processFollowersRequest(user, currentPage).then(function (followers) {
            // Total number of followers
            let numberOfFollowers = followers.length;

            // console.log("DONE -> processFollowersRequest.then followers.length=" + followers.length);
            // console.log("DONE -> processFollowersRequest.then \n" + JSON.stringify(followers, null, 4));

            // Position of first and last followers in current page
            let firstFollowerIndex = ( followersPerPage * currentPage ) - followersPerPage;
            let lastFollowerIndex = (firstFollowerIndex + followersPerPage - 1 >  numberOfFollowers) ? numberOfFollowers - 1 : firstFollowerIndex + followersPerPage - 1;

            // Render view using result
            res.render('pages/index', {
                user: user,
                followers: followers,
                previousSearchUser: username,
                currentPage: currentPage,
                numberOfPages: Math.ceil(numberOfFollowers / followersPerPage),
                firstFollowerIndex: firstFollowerIndex,
                lastFollowerIndex: lastFollowerIndex,
            }); 
        });

    });

});

// Process the request promises and return github api result
function processUserRequest(token, username) {
    github.token = token;
    github.username = username;
    return github.getUser();
}

function processFollowersRequest(username) {
    let followersUrl = github.getFollowersUrl(username);
    return github.getFollowers(followersUrl);
}

// GitHub Object
var github = {
    // Token for authorization
    token: null,

    // Username from the input field
    username: null,

    // Params for gh api request
    url: ghApiUrl,

    // Returns a user as a reponse from GET request to gh api 
    getUser: function() {
        return request({
            method: 'GET',
            json: true,
            uri: github.url + github.username,
            headers: {
                'Authorization': 'Bearer ' + github.token,
                'User-Agent': 'khanhngg'
            },
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
            headers: {
                'Authorization': 'Bearer ' + github.token,
                'User-Agent': 'khanhngg'
            },
        }).then(function (response) {
            if (!followers) { // if followers didn't get passed, initialize new list of followers
                followers = [];
            }
            
            // combine followers of multiple pages
            followers = followers.concat(response.body); 
            // console.log("Current user has " + followers.length + " followers so far");

            if (response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) }).length > 0) {
                // console.log("There is more.");
                var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) })[0])[1];
                return github.getFollowers(next, followers);
            }

            return followers;
        });
    },

};

// Return router
module.exports = router;