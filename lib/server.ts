import session from "express-session";
import { createConfig, createServer } from "express-zod-api";
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
        app.use(
          session({
            secret: process.env.SESSION_SECRET || sessionSalt,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true },
          }),
        );
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(fbStrategy);
        passport.serializeUser((user, done) => {
          done(null, JSON.stringify(user));
        });
        passport.deserializeUser((user, done) => {
          done(null, typeof user === "string" ? JSON.parse(user) : null);
        });
        app.get("/logout", (req, res) => {
          req.logout(() => res.end("logged out"));
        });
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
  {},
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
