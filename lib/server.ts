import session from "express-session";
import { createServer } from "express-zod-api";
import passport from "passport";
import { attachSockets, createSimpleConfig } from "zod-sockets";
import { Server } from "socket.io";
import { sessionSalt } from "../secrets";
import { fbStrategy } from "./authStrategies";

const { httpServer, logger } = await createServer(
  {
    server: { listen: 8090 },
    logger: { level: "debug", color: true },
    cors: true,
  },
  {},
);

const io = new Server();

await attachSockets({
  io,
  target: httpServer,
  config: createSimpleConfig({ logger }),
  actions: [],
});

io.engine.use(
  session({
    secret: process.env.SESSION_SECRET || sessionSalt,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);
io.engine.use(passport.initialize());
io.engine.use(passport.session());

passport.use(fbStrategy);

/*
passport.use(twStrategy);
passport.use(ggStrategy);

passport.serializeUser((user, done) => {
  done(null, {
    _id: user._id,
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
*/
