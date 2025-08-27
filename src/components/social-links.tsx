import Image from 'next/image';
import { Discord, GitHub, Gmail, LinkedIn, Telegram } from './svg';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const SOCIAL_LINKS = [
  {
    name: 'Portfolio',
    url: 'https://jobie.dev',
    imageUrl: '/portfolio-logo.png',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/engrjvramos',
    icon: <GitHub className="size-5" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/engrjvramos/',
    icon: <LinkedIn className="size-5" />,
  },
  {
    name: 'Email',
    url: 'mailto:engrjvramos@gmail.com',
    icon: <Gmail />,
  },
  {
    name: 'Discord',
    url: 'https://discord.com/users/1024682213050167327',
    icon: <Discord />,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/jobieramos',
    icon: <Telegram />,
  },
];

export default function SocialLinks() {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer text-inherit hover:text-black hover:underline dark:hover:text-white">
        Jobie Ramos
      </DialogTrigger>
      <DialogContent className="font-poppins">
        <DialogHeader className="items-center justify-center py-5">
          <DialogTitle className="text-2xl">Jose Roberto Ramos</DialogTitle>
          <DialogDescription className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-1 font-mono text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3">
            Frontend Developer
          </DialogDescription>
        </DialogHeader>

        <ul className="flex w-full flex-col gap-4 overflow-hidden p-2">
          {SOCIAL_LINKS.map(({ icon, name, url, imageUrl }) => (
            <li key={name} className="w-full overflow-hidden rounded-lg">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-input/60 hover:bg-input flex h-12 w-full items-center justify-center gap-2"
              >
                {imageUrl && <Image src={imageUrl} alt={name} width={0} height={0} sizes="100vw" className="size-5" />}
                {icon && icon}
                {name}
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
