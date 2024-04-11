import session from "express-session";
import { createServer } from "express-zod-api";
import passport from "passport";
import { attachSockets, createSimpleConfig } from "zod-sockets";
import { User } from "./user";
import { Server } from "socket.io";
import "./lib/authStrategies";
import routes from "./routes";

const { httpServer, app, logger } = await createServer(
  {
    server: { listen: 8090 },
    logger: { level: "debug", color: true },
    cors: true,
  },
  {},
);

const io = new Server();

io.engine.use(
  session({
    secret: process.env.SESSION_SECRET || "sample",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);
io.engine.use(passport.initialize());
io.engine.use(passport.session());

await attachSockets({
  io,
  target: httpServer,
  config: createSimpleConfig({ logger }),
  actions: [],
});

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
