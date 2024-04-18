import express from "express";
import { z } from "zod";
import { actionsFactory } from "./factory";
import { User } from "./user";

export const onSubmit = actionsFactory.build({
  event: "submit",
  input: z.tuple([z.string().describe("text")]),
  handler: async ({ all, input: [text], client }) => {
    const user = client.getRequest<express.Request>().user as User;
    const message = { author: user, at: new Date(), text };
    await all.broadcast("new_messages", [message]);
  },
});
