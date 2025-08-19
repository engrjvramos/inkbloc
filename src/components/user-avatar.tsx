import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  const fallbackUrl = `https://avatar.vercel.sh/${encodeURIComponent(name)}`;

  return (
    <Avatar>
      <AvatarImage src={image || fallbackUrl} alt={name} />
      <AvatarFallback>
        {name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
