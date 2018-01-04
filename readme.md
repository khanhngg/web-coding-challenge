Shipt Coding Challenge
======================


### GitHub Followers 
https://gh-followers-finder.herokuapp.com

**Description**
A service that allows for a user to search for a GitHub username. On a successful search return, it will display the user's GitHub handle, follower count, and a list of the user's followers.

Running Locally
---------------------------------------
Assuming you have [Node.js](http://nodejs.org/) installed.

```sh
git clone git@github.com:khanhngg/web-coding-challenge.git
cd web-coding-challenge
npm install
nodemon app
```


Implementation Overview
---------------------------------------

### Problem
The web application shall be able to handle serving and displaying a large list of followers of any given GitHub user quickly and easily.  


### Solution

* Using the GitHub API and how the responses are formatted (JSON), the application can retrieve the list of user's followers through the field `followers_url`.
* Since each request can fetch at most 30 followers by default, using [Pagination](https://developer.github.com/v3/#pagination) would allow getting the next load of followers by specifying the `?page` parameter in the request.

### Examples

- **Request to GET a use**

	```
	https://api.github.com/users/octocat
	```

- **Response of getting a user**
	
	```
	{
	  "login": "octocat",
	  "id": 1,
	  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
	  "gravatar_id": "",
	  "url": "https://api.github.com/users/octocat",
	  "html_url": "https://github.com/octocat",
	  "followers_url": "https://api.github.com/users/octocat/followers",
	  ...
	}
	```

- **Request to GET a user's followers using pagination**

	```
	https://api.github.com/users/octocat/followers?page=1
	```

- **Response of getting a user's followers using pagination**
	
	```
	[
	  {
	    "login": "myhduck",
	    ...
	  },
	  {
	    "login": "trevor",
	    ...
	  },
	  ...
	]
	```


Functional Specs
---------------------------------------

- [x] User can type into the search bar to lookup a GitHub handle
- [x] User can view the results for a valid GitHub handle including: 
	- [x] The user's GitHub handle
	- [x] The user's follower count
	- [x] The list of that user's followers
- [x] User can click the `LOAD MORE` button to see the next load of followers until there are no more followers to show


Technical Specs
---------------------------------------

### BACKEND

- **Node.js**: This JavaScript server framework allows me to easily set up a web application that can handle event-based interactions and routing for the backend.
	
- **Express.js**: A light-weight web development framework for Node.js that helps organize my application into a MVC architecture. In other words, it allows me to manage the routes, handle requests, and render views.

```javascript
router.get('/', function(req, res) {
    res.render('pages/index');
});
```



### FRONTEND
- **HTML/CSS**: Besides the basic DOM structure and styling, I'm also using the `data-*` attribute to keep track of the pagination that backend can use to request GitHub API specific pages of followers.

- **JavaScript / jQuery**: Handles user's clicking event for the `LOAD MORE` button by making AJAX GET requests to the backend route `/search`

``` javascript
url: '/search/' + $('#search-user').val() + '/' + nextPageNumber
```
	
- **Bootstrap**: I'm using the latest version `v4.0.0-beta.3` to utilize their responsive grid system for layout and necessary UI components such as **`Input Group`** for the search bar or **`Card`** for the user and followers' thumbnails.


- **EJS (Embedded JavaScript)**: This templating engine, which is also a node module, allows the frontend to display data from the backend's response and reuse different UI components/pages. This is helpful in rendering the list of followers by simply iterating through the array of followers objects that got passed in by the backend.

```html
<h4 class="card-text"><%= user.name %></h4>
```

```html
<% followers.forEach(function(follower) { %>
    <img class="card-img" src=<%= follower.avatar_url %> alt="follower avatar">
<% }); %>
```

### HOSTING PLATFORM

**Heroku** provides the command line interface (CLI) tool for easy app deployment through git commands. Since this is my first time using this service, I chose it because of its simple setup and good documentation.

### TESTING
// TODO


Discussions
--------------------
// TODO things left out/done differently

File Structure
--------------------

```
├── public/
│   ├── stylesheets/
│   │   └── style.css
│   └── scripts/
│       └── load.js
├── routes/
│   ├── index.js
│   └── search.js
├── views/
│   ├── pages/
│   │   └── index.ejs
│   └── partials/
│       ├── followers.ejs
│       ├── footer.ejs
│       ├── head.ejs
│       └── header.ejs
├── app.js
├── node_modules/
└── package.json
```

Walkthrough
--------------------
![Video Walkthrough](https://github.com/khanhngg/web-coding-challenge/blob/master/walkthrough/shipt-gh.gif)


Links
--------------------

* **GitHub API** : [GitHub API](https://developer.github.com/v3/)

* **Resume** : [Resume](#)

* **Portfolio** : [Portfolio](https://khanhngg.github.io/)

* **Hosted Application** : https://gh-followers-finder.herokuapp.com