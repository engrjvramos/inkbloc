import SocialLinks from './social-links';

export default function Footer() {
  return (
    <footer className="px-8 py-8 sm:px-16">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 text-center text-sm sm:flex-row">
        <p className="flex items-center text-center">
          &copy; {new Date().getFullYear()}&nbsp;
          <SocialLinks />. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
