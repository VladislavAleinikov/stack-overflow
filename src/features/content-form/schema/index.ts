import { z } from "zod";

export const contentSchema = z.object({
  content: z.string().nonempty("content required"),
});

export type ContentFormValues = z.infer<typeof contentSchema>;
