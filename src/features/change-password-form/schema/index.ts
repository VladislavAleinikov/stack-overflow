import { z } from "zod";

export const passwordSchema = z.object({
  oldPassword: z.string().nonempty("old password required"),
  newPassword: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(16, "max password length is 16 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$/,
      "password must contain at least one lowercase letter, one uppercase letter, one number and one symbol"
    ),
  confirmPassword: z.string().nonempty("confirmation required"),
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;
