import passport from 'passport';
import {Strategy as FBStrategy} from 'passport-facebook';
import {Strategy as TWStrategy} from 'passport-twitter';
import {Strategy as GGStrategy} from 'passport-google-oauth2';
import {Strategy as VKStrategy} from 'passport-vkontakte';
import User from '../schema/user';
import {oAuth as config} from '../config';
import myconsole from './console';

passport.use(new FBStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'picture.type(small)']
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({
            oauthID: profile.id,
            provider: profile.provider
        }, (err, user) => {
            if (err) {
                myconsole.log(err);
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : '',
                    sounds: true
                });
                user.save(err => {
                    if (err) {
                        myconsole.log(err);
                    } else {
                        myconsole.log('saving user ' + user);
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
    (accessToken, refreshToken, profile, done) => {
        User.findOne({
            oauthID: profile.id,
            provider: profile.provider
        }, (err, user) => {
            if (err) {
                myconsole.log(err);
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : '',
                    sounds: true
                });
                user.save(err => {
                    if (err) {
                        myconsole.log(err);
                    } else {
                        myconsole.log('saving user ' + user);
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
    (request, accessToken, refreshToken, profile, done) => {
        User.findOne({
            oauthID: profile.id,
            provider: profile.provider
        }, (err, user) => {
            if (err) {
                myconsole.log(err);
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : '',
                    sounds: true
                });
                user.save(err => {
                    if (err) {
                        myconsole.log(err);
                    } else {
                        myconsole.log('saving user ' + user);
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
    (accessToken, refreshToken, profile, done) => {
        User.findOne({
            oauthID: profile.id,
            provider: profile.provider
        }, (err, user) => {
            if (err) {
                myconsole.log(err);
            } else if (user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    provider: profile.provider,
                    avatar: profile.photos.length ? profile.photos[0].value : '',
                    sounds: true
                });
                user.save(err => {
                    if (err) {
                        myconsole.log(err);
                    } else {
                        myconsole.log('saving user ' + user);
                        done(null, user);
                    }
                });
            }
        });
    }
));
