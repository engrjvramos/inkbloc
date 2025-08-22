'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CloseToast } from '@/components/ui/sonner';
import { authClient } from '@/lib/auth-client';
import { resetPasswordFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, InfoIcon, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const token = searchParams.get('token');

  const toggleVisibility = (field: keyof typeof isVisible) => {
    setIsVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    try {
      setIsLoading(true);
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token ?? '',
      });
      if (!error) {
        toast.success('Password Reset Successful', {
          description: 'Please login to your account',
          action: CloseToast,
        });
        form.reset();
        router.push('/login');
      } else {
        toast.error('Password Reset Failed', {
          description: error.message,
          action: CloseToast,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[540px] gap-12 p-8 sm:p-12">
      <CardHeader className="justify-center px-0 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-4xl">
          <span className="font-text">InkBloc.</span>
        </div>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>Choose a new password to secure your account</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible.password ? 'text' : 'password'}
                        className="h-11 pe-12"
                        maxLength={64}
                        {...field}
                        aria-invalid={!!form.formState.errors.password}
                      />
                      <Button
                        variant={'ghost'}
                        type="button"
                        className="text-muted-foreground hover:text-muted-foreground absolute top-1/2 right-2 size-8 -translate-y-1/2"
                        onClick={() => toggleVisibility('password')}
                        aria-label={isVisible.password ? 'Hide password' : 'Show password'}
                        aria-pressed={isVisible.password}
                        aria-controls="password"
                      >
                        {isVisible.password ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="flex items-center gap-2">
                    <InfoIcon className="size-4" />
                    At least 8 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible.confirmPassword ? 'text' : 'password'}
                        className="h-11 pe-12"
                        maxLength={64}
                        {...field}
                        aria-invalid={!!form.formState.errors.password}
                      />
                      <Button
                        variant={'ghost'}
                        type="button"
                        className="text-muted-foreground hover:text-muted-foreground absolute top-1/2 right-2 size-8 -translate-y-1/2"
                        onClick={() => toggleVisibility('confirmPassword')}
                        aria-label={isVisible.confirmPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={isVisible.confirmPassword}
                        aria-controls="password"
                      >
                        {isVisible.confirmPassword ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-11 w-full text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
