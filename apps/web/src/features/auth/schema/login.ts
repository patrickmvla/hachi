import { z } from "zod";
import { workEmailSchema } from "./email";

export const loginSchema = z.object({
  email: workEmailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
