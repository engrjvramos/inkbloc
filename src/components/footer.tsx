export default function Footer() {
  return (
    <footer className="bg-neutral-100 px-8 py-8 sm:px-16 dark:bg-zinc-900">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 text-center text-sm sm:flex-row">
        <p className="flex items-center text-center">
          &copy; {new Date().getFullYear()} Jobie Ramos. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
