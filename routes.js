var express = require('express');
var handlers = require('./handlers');

module.exports = function(app, passport, io) {
    // logger
    app.use(handlers.logger);

    // static
    app.use('/static', express.static(__dirname + '/static'));

    // default
    app.get('/', handlers.app);
    app.get('/logout', handlers.logout);

    // auth
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

    // socket io
    io.on('connection', handlers.ioConnect);
};
