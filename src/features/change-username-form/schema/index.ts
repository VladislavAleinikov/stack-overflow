import { z } from "zod";

export const usernameSchema = z.object({
  username: z.string().min(3, "username must be at least 3 characters long"),
});

export type UsernameFormValues = z.infer<typeof usernameSchema>;
