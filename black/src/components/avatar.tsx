"use client";

import { useEffect, useRef, useState } from "react";

export function Avatar({ src, name, alt = name }: { src: string; name: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // An SSR image can fail before React attaches its onError handler.
    if (image.current?.complete && image.current.naturalWidth === 0) setFailed(true);
  }, [src]);
  const initials = name.split(/\s+/).filter(Boolean).slice(-2).map(word => word[0]).join("");
  return failed ? (
    <div className="avatar-fallback" data-testid="avatar-fallback" role="img" aria-label={name}>{initials}</div>
  ) : <img ref={image} className="portrait-image" src={src} alt={alt} width={472} height={709} fetchPriority="high" onError={() => setFailed(true)} />;
}
