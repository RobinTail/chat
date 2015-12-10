var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ios = require('socket.io-express-session');
var session = require('express-session');
var handlers = require('./handlers');
var passport = require('passport');
var auth = require('./auth');
var User = require('./user');

if (process.env.NODE_ENV !== 'production') {
    console.log('Using webpack dev middleware');
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackCompiler = webpack(require('./webpack.config'));
    app.use(webpackDevMiddleware(webpackCompiler, {
        noInfo: true,
        publicPath: '/static/'
    }));
} else {
    console.log('Using webpack build');
}

// database connection
var mongoose = require('mongoose');
var db = require('./db.js');
mongoose.connect(db);
var MongoStore = require('connect-mongo')(session);

// app configuration
app.use(handlers.logger);
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'));
var sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: 'robintail/chat/session/secret',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// serialization functions
passport.serializeUser(function(user, done) {
    //console.log('Serialize: ' + user.name);
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        /*if (!err) {
            console.log('Deserialize: ' + user.name);
        }*/
        done(err, user);
    });
});

// handlers
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
