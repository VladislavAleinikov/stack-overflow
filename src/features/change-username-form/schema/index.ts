import { z } from "zod";

export const usernameSchema = z.object({
  username: z.string().min(5, "username must be at least 5 characters long"),
});

export type UsernameFormValues = z.infer<typeof usernameSchema>;
