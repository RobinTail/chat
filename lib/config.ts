import express from "express";
import { createConfig } from "express-zod-api";
import passport from "passport";
import { z } from "zod";
import { createSimpleConfig } from "zod-sockets";
import { fbStrategy, ggStrategy, twStrategy } from "./authStrategies";
import { messageSchema } from "./message";
import { sessionMw } from "./session-mw";
import { User, userSchema } from "./user";

export const httpConfig = createConfig({
  server: {
    listen: 8090,
    beforeRouting: ({ app }) => {
      app.use(sessionMw);
      app.use(passport.initialize());
      app.use(passport.session());
      passport.use(fbStrategy);
      passport.use(twStrategy);
      passport.use(ggStrategy);
      passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
      });
      passport.deserializeUser((user, done) => {
        done(null, typeof user === "string" ? JSON.parse(user) : null);
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
});

export const socketConfig = createSimpleConfig({
  emission: {
    enter_chat: { schema: z.tuple([userSchema]) },
    leave_chat: { schema: z.tuple([userSchema]) },
    new_messages: { schema: z.tuple([messageSchema.array()]) },
    typing: { schema: z.tuple([z.string().array()]) },
  },
  hooks: {
    onConnection: async ({ logger, client }) => {
      logger.debug("Connected user", client.id);
      const sessionUser = client.getRequest<express.Request>().user;
      if (!sessionUser) {
        return;
      }
      logger.debug("authenticated user", sessionUser);
      await client.broadcast("enter_chat", sessionUser as User);
    },
    onDisconnect: async ({ logger, client }) => {
      logger.debug("Disconnected user", client.id);
      const sessionUser = client.getRequest<express.Request>().user;
      if (!sessionUser) {
        return;
      }
      logger.debug("authenticated user", sessionUser);
      await client.broadcast("leave_chat", sessionUser as User);
    },
  },
});