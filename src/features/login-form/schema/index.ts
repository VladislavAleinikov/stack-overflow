import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "username must be at least 3 characters long"),
  password: z
    .string()
    .min(6, "password must be at least 3 characters long")
    .max(16, "max password length is 16 characters"),
});

export type UserFormValues = z.infer<typeof userSchema>;