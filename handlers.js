var User = require('./user');
var chatCore = require('./chatCore');

function checkAuth(socket) {
    if (!socket.handshake.session.passport) {
        console.log('user not authenticated');
        sendError(socket, 'Not authenticated request');
        return false;
    }
    return true;
}

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
    if (!checkAuth(socket)) { return false; }
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                console.log('user find failure: ' + err);
                sendError(socket, 'Database error');
                return false;
            }
            if (user) {
                console.log('authenticated user ' + user.name);
                socket.handshake.session.userName = user.name;
                chatCore.enterChat(socket);
                socket.on('latest', function() {
                    chatCore.latest(socket);
                });
                socket.on('submit', function(data) {
                    chatCore.submit(socket, data);
                });
                socket.on('disconnect', function() {
                    chatCore.leaveChat(socket,
                        socket.handshake.session.userName);
                });
            }
        });
};

// log out

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

