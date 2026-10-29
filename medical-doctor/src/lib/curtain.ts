export const CURTAIN_KEY = "medical-doctor-curtain-v1";
export const CURTAIN_BOOTSTRAP = `try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('${CURTAIN_KEY}'))document.documentElement.dataset.curtainSkip='1'}catch{}`;
