import express from "express";
import { z } from "zod";
import { factory } from "./factory";
import { User } from "./user";

export const onSubmit = factory.build({
  event: "submit",
  input: z.tuple([z.string().describe("text")]),
  handler: async ({ all, input, client }) => {
    const user = client.getRequest<express.Request>().user as User;
    const message = { author: user, at: new Date(), text: input[0] };
    await all.broadcast("new_messages", [message]);
  },
});
