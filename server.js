import fs from 'fs';
import express from 'express';
import ios from 'socket.io-express-session';
import passport from 'passport';
import User from './schema/user';
import mongoose from 'mongoose';
import myconsole from './lib/console';
import socket from 'socket.io';
import http from 'http';
import './lib/authStrategies';
import initWebpack from './lib/initWebpack';
import {listenTo, dbConnectionUrl} from './config';
import session from './session';
import routes from './routes';

const app = express();
const srv = http.Server(app);
const io = socket(srv);

initWebpack(app);
mongoose.connect(dbConnectionUrl);

const sessionMiddleware = session(mongoose);

app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use(ios(sessionMiddleware));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

routes(app, passport, io);

try {
    fs.unlinkSync(listenTo);
} catch (e) {}
srv.listen(listenTo, function() {
    myconsole.log('Start serving');
});

export default srv;
