export const REVEAL_EVENT = "pickmedev:reveal-profile";

export function revealProfile() {
  document.documentElement.dataset.introState = "revealing";
  document.dispatchEvent(new Event(REVEAL_EVENT));
}
