import fs from 'node:fs';
import express from 'express';
import ios from 'socket.io-express-session';
import passport from 'passport';
import User from './schema/user';
import mongoose from 'mongoose';
import myconsole from './lib/console';
import socket from 'socket.io';
import http from 'http';
import './lib/authStrategies';
import {listenTo, dbConnectionUrl} from './config';
import session from './session';
import routes from './routes';

const app = express();
const srv = http.Server(app);
const io = socket(srv);

mongoose.connect(dbConnectionUrl);

const sessionMiddleware = session(mongoose);

app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use(ios(sessionMiddleware));

passport.serializeUser((user, done) => {
    done(null, {
        _id: user._id, /* following data is used by ioConnect handler */
        name: user.name,
        provider: user.provider,
        avatar: user.avatar
    });
});

passport.deserializeUser((user, done) => {
    User.findById(user._id, (err, user) => {
        done(err, user);
    });
});

routes(app, passport, io);

/* eslint-disable no-empty */
try {
    fs.unlinkSync(listenTo);
} catch (e) {}
/* eslint-enable no-empty */

srv.listen(listenTo, () => {
    myconsole.log('Start serving');
});

export default srv;
