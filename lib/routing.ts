import { Routing } from "express-zod-api";
import passport from "passport";
import { z } from "zod";
import { authFactory } from "./factory";

const dummyEndpoint = {
  method: "get" as const,
  input: z.object({}),
  output: z.object({}),
  handler: async () => ({}),
};

const facebookEndpoint = authFactory
  .use(passport.authenticate("facebook"))
  .build(dummyEndpoint);

const twitterEndpoint = authFactory
  .use(passport.authenticate("twitter"))
  .build(dummyEndpoint);

const googleEndpoint = authFactory
  .use(passport.authenticate("google", { scope: ["email", "profile"] }))
  .build(dummyEndpoint);

const logoutEndpoint = authFactory
  .use((req, {}, next) => {
    req.logout(next);
  })
  .build(dummyEndpoint);

export const routing: Routing = {
  logout: logoutEndpoint,
  auth: {
    facebook: { "": facebookEndpoint, callback: facebookEndpoint },
    twitter: { "": twitterEndpoint, callback: twitterEndpoint },
    google: { "": googleEndpoint, callback: googleEndpoint },
  },
};
