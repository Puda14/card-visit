export const INVITATION_KEY = "nguyen-huu-nhat-invitation-v1";
export const INVITATION_BOOTSTRAP = `try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('${INVITATION_KEY}'))document.documentElement.dataset.invitationSkip='1'}catch{}`;
