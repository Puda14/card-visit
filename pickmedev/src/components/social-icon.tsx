import type { SocialName } from "@/lib/profile";

export function SocialIcon({ name }: { name: SocialName }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="23" height="23" aria-hidden="true">
    {name === "YouTube" ? <path d="M21.5 7.2a3 3 0 0 0-2.1-2.1C17.5 4.6 12 4.6 12 4.6s-5.5 0-7.4.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.4.5 7.4.5s5.5 0 7.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.5-4.8ZM10 15.3V8.7l5.7 3.3-5.7 3.3Z" /> : name === "Facebook" ? <path d="M13.8 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.7 1.8-1.7h1.9V2.4a25 25 0 0 0-2.8-.1c-2.8 0-4.7 1.7-4.7 4.8v2.4H7V13h3v9h3.8Z" /> : <path d="M15.5 3c.3 2.4 1.7 3.9 4 4.1v3.1a8.8 8.8 0 0 1-4-1.2v6.6a5.9 5.9 0 1 1-5.2-5.9v3.2a2.8 2.8 0 1 0 2 2.7V3h3.2Z" />}
  </svg>;
}
