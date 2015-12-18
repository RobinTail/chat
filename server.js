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
import {dbConnectionUrl} from './config';
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

// launch server
srv.listen(8080, function() {
    myconsole.log('Start serving');
});

export default srv;
