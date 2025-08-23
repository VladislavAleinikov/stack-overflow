import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(5, "username must be at least 5 characters long"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(16, "max password length is 16 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$/,
      "password must contain at least one lowercase letter, one uppercase letter, one number and one symbol"
    ),
  confirmPassword: z.string(),
});

export type UserFormValues = z.infer<typeof userSchema>;