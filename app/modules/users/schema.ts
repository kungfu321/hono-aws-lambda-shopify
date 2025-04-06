import { z } from 'zod';

// Define User schema with Zod
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// Create schemas for different operations
export const CreateUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export const UserParamSchema = z.object({
  id: z.string().uuid()
});

// Type definitions
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserParam = z.infer<typeof UserParamSchema>; 