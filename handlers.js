var User = require('./user');

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
    if (!socket.handshake.session.passport) {
        console.log('user not authenticated');
        socket.emit('latest', {
            error: true,
            message: 'Not authenticated request'
        });
        return false;
    }
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                console.log('user not found in db');
                socket.emit('latest', {
                    error: true,
                    message: 'User not found'
                });
                return false;
            }
            console.log('authenticated user ' + user.name);
            socket.emit('latest', {
                error: false,
                messages: [
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'},
                    {'text': 'test1'},
                    {'text': 'test2'},
                    {'text': 'test3'}
                ]
            });
        });
};

// log out

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

