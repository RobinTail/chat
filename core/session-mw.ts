import session from "express-session";
import { sessionSalt } from "../secrets";

export const sessionMw = session({
  secret: process.env.SESSION_SALT || sessionSalt,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
