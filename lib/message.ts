import { z } from "zod";
import { userSchema } from "./user";

export const messageSchema = z.object({
  author: userSchema,
  at: z.date(),
  text: z.string(),
});
