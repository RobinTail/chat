import React from "react";
import { Facebook } from "./icons/Facebook.tsx";
import { Google } from "./icons/Google.tsx";
import { Twitter } from "./icons/Twitter.tsx";

export const providers = {
  facebook: {
    color: "#3b5998",
    Logo: Facebook,
  },
  twitter: {
    color: "#00aced",
    Logo: Twitter,
  },
  google: {
    color: "#dd4b39",
    Logo: Google,
  },
} satisfies Record<string, { color: string; Logo: React.FC }>;

export type Provider = keyof typeof providers;
