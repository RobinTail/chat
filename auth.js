var passport = require('passport');
var FBStrategy = require('passport-facebook').Strategy;
var TWStrategy = require('passport-twitter').Strategy;
var GGStrategy = require('passport-google-oauth2').Strategy;
var VKStrategy = require('passport-vkontakte').Strategy;
var User = require('./user.js');
var config = require('./config.js');

module.exports = passport.use(new FBStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
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
                    created: Date.now()
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
