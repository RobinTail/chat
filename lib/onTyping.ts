import express from "express";
import { z } from "zod";
import { factory } from "./factory";
import { User } from "./user";

const usersTyping: Record<string, string> = {}; // id:name

export const onTyping = factory.build({
  event: "typing",
  input: z.tuple([z.boolean()]),
  handler: async ({ input: [isTyping], client }) => {
    const user = client.getRequest<express.Request>().user as User;
    if (isTyping) {
      usersTyping[user.oauthID] = user.name;
    } else {
      delete usersTyping[user.oauthID];
    }
    await client.broadcast("typing", Object.values(usersTyping));
  },
});
