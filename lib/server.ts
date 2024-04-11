import session from "express-session";
import { createConfig, createServer, ServeStatic } from "express-zod-api";
import passport from "passport";
import { z } from "zod";
import { attachSockets, createSimpleConfig } from "zod-sockets";
import { Server } from "socket.io";
import { sessionSalt } from "../secrets";
import { fbStrategy } from "./authStrategies";

const { httpServer, logger } = await createServer(
  createConfig({
    server: {
      listen: 8090,
      beforeRouting: ({ app }) => {
        app.get("/auth/facebook", passport.authenticate("facebook"));
        app.get(
          "/auth/facebook/callback",
          passport.authenticate("facebook", {
            failureRedirect: "/",
            successRedirect: "/",
          }),
        );
      },
    },
    logger: { level: "debug", color: true },
    cors: true,
  }),
  {
    static: new ServeStatic("/static"),
  },
);

const io = new Server();

await attachSockets({
  io,
  target: httpServer,
  config: createSimpleConfig({
    logger,
    emission: {
      enter_chat: {
        schema: z.tuple([
          z.object({
            id: z.string(),
            name: z.string(),
            provider: z.string(),
          }),
        ]),
      },
    },
    hooks: {
      onConnection: async ({ logger, client }) => {
        logger.debug("handshake", client.handshake);
        const sessionUser = client.handshake.auth.passport?.user;
        if (!sessionUser) {
          return;
        }
        logger.info("authenticated user", sessionUser);
      },
    },
  }),
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