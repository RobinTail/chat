import {
  createMiddleware,
  defaultEndpointsFactory,
  EndpointsFactory,
  Routing,
} from "express-zod-api";
import passport from "passport";
import { z } from "zod";
import { authFactory } from "./factory";
import { User, userSchema } from "./user";

const dummyEndpoint: Parameters<EndpointsFactory["build"]>[0] = {
  method: "get",
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

const selfAwareEndpoint = defaultEndpointsFactory
  .addMiddleware(
    createMiddleware({
      input: z.object({}),
      middleware: async ({ request: { user } }) => ({
        user: user as User | undefined,
      }),
    }),
  )
  .build({
    method: "get",
    input: z.object({}),
    output: z.object({ user: userSchema.optional() }),
    handler: async ({ options: { user } }) => ({ user }),
  });

export const routing: Routing = {
  logout: logoutEndpoint,
  auth: {
    facebook: { "": facebookEndpoint, callback: facebookEndpoint },
    twitter: { "": twitterEndpoint, callback: twitterEndpoint },
    google: { "": googleEndpoint, callback: googleEndpoint },
  },
  me: selfAwareEndpoint,
};
