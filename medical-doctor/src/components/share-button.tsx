"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, labels }: { title: string; labels: { share: string; copied: string; fallback: string } }) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setMessage(labels.copied);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage(labels.fallback);
    }
  }
  return <div className="share-wrap"><button className="share-button" onClick={share} aria-label={labels.share}>{copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}<span>{labels.share}</span></button><span className="share-status" role="status">{message}</span></div>;
}
