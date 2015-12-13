var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ios = require('socket.io-express-session');
var handlers = require('./handlers');
var passport = require('passport');
var User = require('./user');
var mongoose = require('mongoose');

// load authentication strategies
require('./auth');

// set up webpack
require('./webpack.init')(app);

// database connection
mongoose.connect(require('./db.js'));

// app configuration
var sessionMiddleware = require('./session')(mongoose);
app.use(handlers.logger);
app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// serialization functions
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// handlers
app.use('/static', express.static(__dirname + '/static'));
app.get('/', handlers.app);
app.get('/logout', handlers.logout);

// auth handlers
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/'}),
    handlers.authSuccess);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {failureRedirect: '/'}),
    handlers.authSuccess);
app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    handlers.authSuccess);
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));
app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', {failureRedirect: '/'}),
    handlers.authSuccess);

// io connection
io.use(ios(sessionMiddleware));
io.on('connection', handlers.ioConnect);

// launch server
http.listen(8080, function() {
    console.log('Start serving');
});
