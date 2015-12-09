var express = require('express');
var app = express();
var session = require('express-session');
var handlers = require('./handlers');
var passport = require('passport');
var auth = require('./auth');
var User = require('./user');

app.use(handlers.logger);

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
app.use('/static', express.static(__dirname + '/static'));
//app.use(express.cookieParser());
//app.use(express.bodyParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'robintail/chat/session/secret',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());

// serialization functions
passport.serializeUser(function(user, done) {
    console.log('Serialize: ' + user);
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log('Deserialize: ' + user);
        done(err, user);
    });
});

app.get('/', handlers.app);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/'}),
    handlers.authSuccess);
app.get('/chat', isAuthMiddleware, handlers.chat);
app.get('/logout', handlers.logout);

app.listen(8080, function() {
    console.log('Start serving');
});

function isAuthMiddleware(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}
