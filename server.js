var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ios = require('socket.io-express-session');
var passport = require('passport');
var User = require('./schema/user');
var mongoose = require('mongoose');

// load authentication strategies
require('./lib/auth');

// set up webpack
require('./lib/webpack.init.js')(app);

// database connection
mongoose.connect(require('./db.js'));

// app configuration
var sessionMiddleware = require('./session')(mongoose);
app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use(ios(sessionMiddleware));

// serialization functions
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// router
require('./routes')(app, passport, io);

// launch server
http.listen(8080, function() {
    console.log('Start serving');
});
