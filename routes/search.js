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

    // Get the username value from input field
    var username = req.body.username;

    // If empty input field, redirect to home page
    if (!username) {
        res.redirect('/');
    } else {
        // Max followers per page
        let followersPerPage = 30;
        let currentPage = 1;

        // Request user from GitHub API call and process the response
        processUserRequest(process.env.GH_TOKEN, username).then(function(user) {
            // Total number of followers
            let numberOfFollowers = user.followers;

            // Request follower of user from GitHub API call and process the response
            processFollowersRequest(user, currentPage).then(function (followers) {

                // Render view using result
                res.render('pages/index', {
                    user: user,
                    followers: followers,
                    previousSearchUser: username,
                    currentPage: currentPage,
                    numberOfPages: Math.ceil(numberOfFollowers / followersPerPage),
                }); 
            });

        });
    }

});

// GET: find followers of user from page
// router.get('/', function(req, res) {
router.get('/:username/:page', function(req, res) {

    // Get the username value from url params
    var username = req.params.username;

    // Max followers per page
    let followersPerPage = 30;
    let currentPage = req.params.page || 1;

    // Request user from GitHub API call and process the response
    processUserRequest(process.env.GH_TOKEN, username).then(function(user) {

        // Total number of followers
        let numberOfFollowers = user.followers;
        
        // Request follower of user from GitHub API call and process the response
        processFollowersRequest(user, currentPage).then(function (followers) {

            // Render view using result
            res.render('partials/followers', {
                followers: followers,
            }); 

        });

    });

});

// Process the request promises and return a user from github api
function processUserRequest(token, username) {
    github.token = token;
    github.username = username;
    return github.getUser();
}

// Process the request promises and return a list of followers at the current page from github api
function processFollowersRequest(username, currentPage) {
    let followersUrl = github.getFollowersUrl(username);
    return github.getFollowers(followersUrl, currentPage);
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

    // Returns the followers url of user
    getFollowersUrl: function(user) {
        return user.followers_url;
    },

    // Returns the followers at the current page
    getFollowers: function(uri, currentPage) {
        return request({
            method: 'GET',
            json: true,
            uri: uri + '?page=' + currentPage,
            resolveWithFullResponse: true,
            headers: {
                'Authorization': 'Bearer ' + github.token,
                'User-Agent': 'khanhngg'
            },
        }).then(function (response) {
            followers = response.body; 
            return followers;
        });
    },

};

// Return router
module.exports = router;