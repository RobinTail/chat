import * as chatCore from './chatCore';
import myconsole from './console';

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
    myconsole.log('new io connection');
    if (!checkSocketAuth(socket)) { return; }

    socket.on('submit', data => {
        chatCore.submit(socket, data);
    });
    socket.on('start_typing', () => {
        chatCore.startTyping(socket);
    });
    socket.on('stop_typing', () => {
        chatCore.stopTyping(socket);
    });
    socket.on('sounds', value => {
        chatCore.setSounds(socket, value);
    });
    socket.on('disconnect', () => {
        chatCore.leaveChat(socket);
    });

    let sessionUser = socket.handshake.session.passport.user;
    myconsole.log('authenticated user %s (%s)', sessionUser.name, sessionUser.provider);
    chatCore.enterChat(socket);
    chatCore.sendLatestMessages(socket);
}

export function logout(req, res) {
    req.logout();
    res.redirect('/');
}
