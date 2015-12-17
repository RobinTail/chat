var User = require('./schema/user');
var chatCore = require('./lib/chatCore');
var myconsole = require('./lib/console');

function checkAuth(socket) {
    if (!socket.handshake.session.passport) {
        myconsole.log('user not authenticated');
        chatCore.sendError(socket, 'Not authenticated request');
        return false;
    }
    return true;
}

// logger

module.exports.logger = function(req, res, next) {
    myconsole.log('Request: ' + req.method + ' ' + req.originalUrl);
    next();
};

// entry point

module.exports.app = function(req, res) {
    myconsole.log('Feeding entry');
    res.render('index', {
        applicationData: {
            isAuthenticated: req.isAuthenticated(),
            sounds: typeof req.user == 'object' ? (
                        typeof req.user.sounds == 'undefined' ?
                            true : req.user.sounds) :
                        true,
            provider: typeof req.user == 'object' ? req.user.provider : ''
        }
    });
};

// fires when auth was successful

module.exports.authSuccess = function(req, res) {
    res.redirect('/');
};

// when io connection started

module.exports.ioConnect = function(socket) {
    myconsole.log('io connection');
    if (!checkAuth(socket)) { return false; }
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                myconsole.log('user find failure: ' + err);
                sendError(socket, 'Database error');
                return false;
            }
            if (user) {
                myconsole.log('authenticated user ' + user.name);
                // save user name to socket passport
                socket.handshake.session.passport.userName = user.name;
                socket.handshake.session.passport.provider = user.provider;
                socket.on('latest', function() {
                    chatCore.latest(socket);
                });
                socket.on('submit', function(data) {
                    chatCore.submit(socket, data);
                });
                socket.on('start_typing', function() {
                    chatCore.startTyping(socket);
                });
                socket.on('stop_typing', function() {
                    chatCore.stopTyping(socket);
                });
                socket.on('sounds', function(value) {
                    myconsole.log('sounds set: ' + value);
                    user.sounds = value;
                    user.save(function(err) {
                        if (err) {
                            myconsole.log('error saving sounds ' + err);
                        }
                    });
                });
                socket.on('disconnect', function() {
                    chatCore.leaveChat(socket);
                });
                chatCore.enterChat(socket);
            }
        });
};

// log out

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

