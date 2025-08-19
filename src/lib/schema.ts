import z from 'zod';

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
  todo: z
    .string()
    .min(1, {
      message: 'Todo is required',
    })
    .max(100, {
      message: 'Todo must be at most 100 characters long',
    }),
});

export type TTodoSchema = z.infer<typeof todoSchema>;
