import { createServer } from "express-zod-api";
import ios from "socket.io-express-session";
import passport from "passport";
import { User } from "./user";
import socket from "socket.io";
import "./lib/authStrategies";
import session from "./session";
import routes from "./routes";

const { httpServer, app } = await createServer(
  {
    server: { listen: 8090 },
    logger: { level: "debug", color: true },
    cors: true,
  },
  {},
);

const io = socket(srv);

const sessionMiddleware = session();

app.set("view engine", "ejs");
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use(ios(sessionMiddleware));

passport.serializeUser((user, done) => {
  done(null, {
    _id: user._id /* following data is used by ioConnect handler */,
    name: user.name,
    provider: user.provider,
    avatar: user.avatar,
  });
});

passport.deserializeUser((user, done) => {
  User.findById(user._id, (err, user) => {
    done(err, user);
  });
});

routes(app, passport, io);
