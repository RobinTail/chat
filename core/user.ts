import { z } from "zod";

export const userSchema = z
  .object({
    oauthID: z.string(),
    name: z.string(),
    provider: z.enum(["facebook", "twitter", "google"]),
    avatar: z.string(),
  })
  .describe("user");

export type User = z.infer<typeof userSchema>;
