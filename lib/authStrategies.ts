import { Strategy as FBStrategy } from "passport-facebook";
import { User } from "./user";
import { oAuth as config } from "../secrets";

export const fbStrategy = new FBStrategy(
  {
    clientID: config.facebook.appId,
    clientSecret: config.facebook.secret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "displayName", "picture.type(small)"],
  },
  (accessToken, refreshToken, profile, done) =>
    done(null, {
      oauthID: profile.id,
      name: profile.displayName,
      provider: profile.provider,
      avatar: profile.photos?.length ? profile.photos[0].value : "",
    } satisfies User),
);

/*
export const twStrategy = new TWStrategy(
  {
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL,
  },
  ({}, {}, profile, done) =>
    done(null, {
      oauthID: profile.id,
      name: profile.displayName,
      provider: profile.provider,
      avatar: profile.photos?.length ? profile.photos[0].value : "",
    } satisfies User),
);

export const ggStrategy = new GGStrategy(
  {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
  },
  ({}, {}, profile, done) => {
    done(null, {
      oauthID: profile.id,
      name: profile.displayName,
      provider: profile.provider,
      avatar: profile.photos?.length ? profile.photos[0].value : "",
    } satisfies User);
  },
);
*/
