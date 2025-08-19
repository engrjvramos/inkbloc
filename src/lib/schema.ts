import z from 'zod';

export const todoIdSchema = z.cuid();

export const loginFormSchema = z.object({
  email: z.email().min(1, {
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const registerFormSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    email: z.email().min(1, {
      message: 'Email is required',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string().min(1, {
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const forgotPasswordFormSchema = z.object({
  email: z.email().min(1, {
    message: 'Email is required',
  }),
});

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string().min(1, {
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const todoSchema = z.object({
  todo: z.string().max(250, {
    message: 'Todo must be at most 250 characters long',
  }),
  isComplete: z.boolean().default(false).nonoptional(),
  isImportant: z.boolean().default(false).nonoptional(),
});

export type TTodoSchema = z.infer<typeof todoSchema>;
