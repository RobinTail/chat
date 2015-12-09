var User = require('./user');

// logger

module.exports.logger = function(req, res, next) {
    console.log('Request: ' + req.method + ' ' + req.originalUrl);
    next();
};

// entry html file

module.exports.app = function(req, res) {
    console.log('Feeding entry');
    res.sendFile(__dirname + '/static/index.html');
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

// check auth and show chat

module.exports.chat = function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if (err) {
            console.log('Auth Error: ' + err);  // handle errors
            req.redirect('/');
        } else {
            console.log('Auth Success: ' + user);
        }
    });
    res.end('OK :)');
};
