import * as z from "zod";

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Add other schemas as needed based on your prisma schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  code: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;