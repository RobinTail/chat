import { z } from "zod";

export const userSchema = z
  .object({
    oauthID: z.string(),
    name: z.string(),
    provider: z.string(),
    avatar: z.string(),
  })
  .describe("user");

export type User = z.infer<typeof userSchema>;
