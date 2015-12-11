var passport = require('passport');
var FBStrategy = require('passport-facebook').Strategy;
var TWStrategy = require('passport-twitter').Strategy;
var GGStrategy = require('passport-google-oauth2').Strategy;
var VKStrategy = require('passport-vkontakte').Strategy;
var User = require('./user.js');
var config = require('./config.js');

passport.use(new FBStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'picture.type(small)']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            oauthID: profile.id
        }, function(err, user) {
            if (err) {
                console.log(err);  // handle errors!
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : ''
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log('saving user ' + user);
                        done(null, user);
                    }
                });
            }
        });
    }
));

passport.use(new TWStrategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: config.twitter.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            oauthID: profile.id
        }, function(err, user) {
            if (err) {
                console.log(err);  // handle errors!
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : ''
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log('saving user ' + user);
                        done(null, user);
                    }
                });
            }
        });
    }
));

passport.use(new GGStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(request, accessToken, refreshToken, profile, done) {
        User.findOne({
            oauthID: profile.id
        }, function(err, user) {
            if (err) {
                console.log(err);  // handle errors!
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : ''
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log('saving user ' + user);
                        done(null, user);
                    }
                });
            }
        });
    }
));

passport.use(new VKStrategy({
        clientID: config.vk.clientID,
        clientSecret: config.vk.clientSecret,
        callbackURL: config.vk.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            oauthID: profile.id
        }, function(err, user) {
            if (err) {
                console.log(err);  // handle errors!
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : ''
                });
                user.save(function(err) {
                    if (err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log('saving user ' + user);
                        done(null, user);
                    }
                });
            }
        });
    }
));

module.exports = null;
