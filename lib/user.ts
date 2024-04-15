import { z } from "zod";

export const userSchema = z.object({
  oauthID: z.string(),
  name: z.string(),
  provider: z.string(),
  avatar: z.string(),
});

export type User = z.infer<typeof userSchema>;
