import session from "express-session";
import { createConfig, createServer } from "express-zod-api";
import passport from "passport";
import { z } from "zod";
import { attachSockets, createSimpleConfig } from "zod-sockets";
import { Server } from "socket.io";
import { sessionSalt } from "../secrets";
import { fbStrategy, ggStrategy, twStrategy } from "./authStrategies";
import express from "express";
import { User } from "./user";

const sessMw = session({
  secret: process.env.SESSION_SECRET || sessionSalt,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

const serializer = JSON.stringify;
const deserializer = JSON.parse;

const { httpServer, logger } = await createServer(
  createConfig({
    server: {
      listen: 8090,
      beforeRouting: ({ app }) => {
        app.use(sessMw);
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(fbStrategy);
        passport.use(twStrategy);
        passport.use(ggStrategy);
        passport.serializeUser((user, done) => {
          done(null, serializer(user));
        });
        passport.deserializeUser((user, done) => {
          done(null, typeof user === "string" ? deserializer(user) : null);
        });
        app.get("/logout", (req, res) => {
          req.logout(() => res.redirect("http://localhost:8080"));
        });
        app.get("/auth/facebook", passport.authenticate("facebook"));
        app.get(
          "/auth/facebook/callback",
          passport.authenticate("facebook"),
          (req, res) => {
            res.redirect(
              "http://localhost:8080/?" + new URLSearchParams({ ...req.user }),
            );
          },
        );
        app.get("/auth/twitter", passport.authenticate("twitter"));
        app.get(
          "/auth/twitter/callback",
          passport.authenticate("twitter"),
          (req, res) => {
            res.redirect(
              "http://localhost:8080/?" + new URLSearchParams({ ...req.user }),
            );
          },
        );
        app.get(
          "/auth/google",
          passport.authenticate("google", { scope: ["email", "profile"] }),
        );
        app.get(
          "/auth/google/callback",
          passport.authenticate("google"),
          (req, res) => {
            res.redirect(
              "http://localhost:8080/?" + new URLSearchParams({ ...req.user }),
            );
          },
        );
      },
    },
    logger: { level: "debug", color: true },
    cors: true,
  }),
  {},
);

const io = new Server({
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});

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
        const sessionObj = (client.getRequest() as express.Request).session;
        const serializedUser = sessionObj.passport?.user;
        const sessionUser =
          typeof serializedUser === "string"
            ? (deserializer(serializedUser) as User)
            : undefined;
        if (!sessionUser) {
          return;
        }
        logger.info("authenticated user", sessionUser);
      },
    },
  }),
  actions: [],
});

io.engine.use(sessMw);
