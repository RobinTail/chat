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

export const routing: Routing = {
  logout: authFactory
    .use((req, {}, next) => {
      req.logout(next);
    })
    .build(dummyEndpoint),
  auth: {
    facebook: {
      "": authFactory
        .use(passport.authenticate("facebook"))
        .build(dummyEndpoint),
      callback: authFactory
        .use(passport.authenticate("facebook"))
        .build(dummyEndpoint),
    },
    twitter: {
      "": authFactory
        .use(passport.authenticate("twitter"))
        .build(dummyEndpoint),
      callback: authFactory
        .use(passport.authenticate("twitter"))
        .build(dummyEndpoint),
    },
    google: {
      "": authFactory
        .use(passport.authenticate("google", { scope: ["email", "profile"] }))
        .build(dummyEndpoint),
      callback: authFactory
        .use(passport.authenticate("google"))
        .build(dummyEndpoint),
    },
  },
};
