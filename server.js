import express from 'express';
import ios from 'socket.io-express-session';
import passport from 'passport';
import User from './schema/user';
import mongoose from 'mongoose';
import myconsole from './lib/console';
import socket from 'socket.io';
import http2 from 'http';
// load authentication strategies
import './lib/auth';
import initWebpack from './lib/initWebpack';
// database connection
import uri from './db';
// app configuration
import session from './session';
import routes from './routes';

const app = express();
const http = http2.Server(app);
const io = socket(http);

initWebpack(app);
mongoose.connect(uri);

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
http.listen(8080, function() {
    myconsole.log('Start serving');
});

export default http;
