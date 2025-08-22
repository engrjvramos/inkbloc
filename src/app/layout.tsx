import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Mona_Sans, Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--display-family',
});

const mona_sans = Mona_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--text-family',
});

export const metadata: Metadata = {
  title: 'InkBloc - Minimalist Todo App',
  description:
    'InkBloc is a minimalist todo app designed to keep your tasks simple, organized, and clutter-free. Stay focused on what matters with clean task management.',
  keywords: [
    'InkBloc',
    'minimalist todo app',
    'simple task manager',
    'productivity app',
    'distraction free',
    'task organizer',
    'todo list',
    'focus app',
  ],
  authors: [{ name: 'Jobie Ramos', url: 'https://jobie.dev' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'InkBloc - Minimalist Todo App',
    description:
      'Stay organized and focused with InkBloc, a distraction-free todo app that helps you manage tasks effortlessly.',
    url: 'https://inkbloc.vercel.app',
    siteName: 'InkBloc',
    images: [
      {
        url: 'https://inkbloc.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InkBloc - Minimalist Todo App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${mona_sans.variable} font-display antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
