import { createServer } from "express-zod-api";
import passport from "passport";
import { Server } from "socket.io";
import { attachSockets } from "zod-sockets";
import { actions } from "./actions";
import { httpConfig, socketConfig } from "./config";
import { routing } from "./routing";
import { sessionMw } from "./session-mw";

const { httpServer, logger } = await createServer(httpConfig, routing);

const io = new Server({
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});

await attachSockets({
  io,
  target: httpServer,
  config: socketConfig,
  actions,
  logger,
});

io.engine.use(sessionMw);
io.engine.use(passport.initialize());
io.engine.use(passport.session());
