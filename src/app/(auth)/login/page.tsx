'use client';

import { GitHub, Google } from '@/components/svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CloseToast } from '@/components/ui/sonner';
import { authClient } from '@/lib/auth-client';
import { loginFormSchema } from '@/lib/schema';
import { signInUser } from '@/server/auth-actions';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      setIsLoading(true);
      const response = await signInUser(values.email, values.password);
      if (response.success) {
        toast.success(response.message, {
          action: CloseToast,
        });
        form.reset();
        router.push('/');
      } else {
        toast.error('Failed to login', {
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
        <div className="mb-4 flex items-center justify-center gap-2 text-4xl">
          <span className="font-text">InkBloc.</span>
        </div>
        <CardTitle className="text-2xl">Welcome to InkBloc</CardTitle>
        <CardDescription className="">Please login to continue</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="h-11"
                      maxLength={100}
                      autoFocus
                      {...field}
                    />
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
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground ml-auto inline-block text-sm hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? 'text' : 'password'}
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
                        onClick={toggleVisibility}
                        aria-label={isVisible ? 'Hide password' : 'Show password'}
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
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
                'Login'
              )}
            </Button>
          </form>
        </Form>
        <div className="after:border-border relative my-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">Or</span>
        </div>
        <div className="flex flex-col gap-3">
          <Button className="h-11 w-full" variant={'outline'} disabled={isGooglePending} onClick={handleGoogleLogin}>
            {isGooglePending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Google className="size-5" />
                Sign in with Google
              </>
            )}
          </Button>
          <Button className="h-11 w-full" variant={'outline'} disabled={isGithubPending} onClick={handleGithubLogin}>
            {isGithubPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
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
          No account yet?{' '}
          <Link href={'/register'} className="text-foreground hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
