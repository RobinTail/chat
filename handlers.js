var User = require('./user');
var Chat = require('./chat');

// logger

module.exports.logger = function(req, res, next) {
    console.log('Request: ' + req.method + ' ' + req.originalUrl);
    next();
};

// entry point

module.exports.app = function(req, res) {
    console.log('Feeding entry');
    res.render('index', {
        applicationData: {
            isAuthenticated: req.isAuthenticated()
        }
    });
};

// fires when auth was successful

module.exports.authSuccess = function(req, res) {
    res.redirect('/chat');
};

// log out

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

