import User from './schema/user';
import * as chatCore from './lib/chatCore';
import myconsole from './lib/console';

function isPropertyDefined(obj, path) {
    path.split('.').forEach(key => { obj = obj && obj[key]; });
    return (typeof obj != 'undefined' && obj !== null);
}

function checkSocketAuth(socket) {
    if (isPropertyDefined(socket, 'handshake.session.passport.user._id')) {
        return true;
    }
    myconsole.log('User not authenticated');
    return false;
}

export function catcher(err, req, res, next) {
    res.render('index', {
        applicationData: {
            isAuthenticated: false,
            error: true,
            data: err
        }
    });
    next();
}

export function logger(req, res, next) {
    myconsole.log('Request: ' + req.method + ' ' + req.originalUrl);
    next();
}

export function app(req, res) {
    myconsole.log('Feeding entry');
    res.render('index', {
        applicationData: {
            isAuthenticated: req.isAuthenticated(),
            userID: req.user ? req.user._id : undefined,
            name: req.user ? req.user.name : undefined,
            sounds: req.user ? req.user.sounds : undefined,
            provider: req.user ? req.user.provider : undefined,
            avatar: req.user ? req.user.avatar : undefined
        }
    });
}

export function authSuccess(req, res) {
    res.redirect('/');
}

export function ioConnect(socket) {
    myconsole.log('io connection');
    if (!checkAuth(socket)) { return false; }
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                myconsole.log('user find failure: ' + err);
                chatCore.sendError(socket, 'Database error');
                return false;
            }
            if (user) {
                myconsole.log('authenticated user %s (%s)', user.name, user.provider);
                // save user name to socket passport
                socket.handshake.session.passport.userName = user.name;
                socket.handshake.session.passport.provider = user.provider;
                socket.handshake.session.passport.avatar = user.avatar;
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
}

export function logout(req, res) {
    req.logout();
    res.redirect('/');
}
