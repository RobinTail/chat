import express from "express";
import { createConfig } from "express-zod-api";
import fs from "node:fs";
import passport from "passport";
import { z } from "zod";
import { createSimpleConfig } from "zod-sockets";
import { fbStrategy, ggStrategy, twStrategy } from "./authStrategies";
import { messageSchema } from "./message";
import { sessionMw } from "./session-mw";
import { User, userSchema } from "./user";

const sslDir = "/etc/letsencrypt/live/chat-core.robintail.cz";
export const appUrl = process.env.APP_URL || "http://localhost:8080";
const httpListen =
  "CORE_HTTP" in process.env ? parseInt(process.env.CORE_HTTP!, 10) : 8090;
const sslListen =
  "CORE_SSL" in process.env ? parseInt(process.env.CORE_SSL!, 10) : undefined;

export const httpConfig = createConfig({
  server: {
    listen: httpListen,
    beforeRouting: ({ app }) => {
      app.use(sessionMw);
      app.use(passport.initialize());
      app.use(passport.session());
      passport.use(fbStrategy);
      passport.use(twStrategy);
      passport.use(ggStrategy);
      passport.serializeUser((user, done) => {
        try {
          done(null, JSON.stringify(user));
        } catch (e) {
          done(e);
        }
      });
      passport.deserializeUser((user, done) => {
        try {
          done(null, typeof user === "string" ? JSON.parse(user) : null);
        } catch (e) {
          done(e);
        }
      });
    },
  },
  https: sslListen
    ? {
        listen: sslListen,
        options: {
          cert: fs.readFileSync(`${sslDir}/fullchain.pem`, "utf-8"),
          key: fs.readFileSync(`${sslDir}/privkey.pem`, "utf-8"),
        },
      }
    : undefined,
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
