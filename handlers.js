var chatCore = require('./chatCore');

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
    res.redirect('/');
};

// when io connection started

module.exports.ioConnect = function(socket) {
    console.log('io connection');
    chatCore.latest(socket);
    socket.on('submit', function(data) {
        chatCore.submit(socket, data);
    });
};

// log out

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

