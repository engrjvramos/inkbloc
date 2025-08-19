'use client';

import { GitHub, Google } from '@/components/svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CloseToast } from '@/components/ui/sonner';
import { authClient } from '@/lib/auth-client';
import { registerFormSchema } from '@/lib/schema';
import { signUpUser } from '@/server/actions';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, InfoIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isVisible, setIsVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof typeof isVisible) => {
    setIsVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      setIsLoading(true);
      const response = await signUpUser(values.email, values.password, values.name);
      if (response.success) {
        toast.success('Registration Successful!', {
          description: response.message,
          action: CloseToast,
        });
        form.reset();
        router.push('/login');
      } else {
        toast.error('Failed to register', {
          description: response.message,
          action: CloseToast,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onError: () => {
            toast.error('Oops! Something went wrong.');
          },
        },
      });
    });
  };

  const handleGithubLogin = async () => {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
        fetchOptions: {
          onError: () => {
            toast.error('Oops! Something went wrong.');
          },
        },
      });
    });
  };

  return (
    <Card className="w-full max-w-[540px] gap-12 p-8 sm:p-12">
      <CardHeader className="justify-center px-0 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-2xl">
          <span className="font-pacifico">InkBloc</span>
        </div>
        <CardTitle className="text-2xl capitalize">Create your account</CardTitle>
        <CardDescription className="text-pretty">
          Sign up to start organizing your notes and boost your productivity
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="h-11" maxLength={100} autoFocus {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" className="h-11" maxLength={100} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible.password ? 'text' : 'password'}
                        placeholder="Password"
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
                  <FormLabel>Confirm Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible.confirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
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
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Register'}
            </Button>
          </form>
        </Form>
        <div className="after:border-border relative my-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">Or</span>
        </div>
        <div className="flex flex-col gap-3">
          <Button className="h-11 w-full" variant={'outline'} disabled={isGooglePending} onClick={handleGoogleLogin}>
            {isGooglePending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Google className="size-5" />
                Sign in with Google
              </>
            )}
          </Button>
          <Button className="h-11 w-full" variant={'outline'} disabled={isGithubPending} onClick={handleGithubLogin}>
            {isGithubPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <GitHub className="size-5" />
                Sign in with Github
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t pt-0">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href={'/login'} className="text-foreground hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
