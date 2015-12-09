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
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                socket.emit('latest', {
                    error: true,
                    message: 'User not found'
                });
            } else {
                console.log('io connection from ' + user.name);
                socket.emit('latest', {
                    error: false,
                    messages: [
                        {'text': 'test1'},
                        {'text': 'test2'},
                        {'text': 'test3'}
                    ]
                });
            }
        });
}

// log out

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

