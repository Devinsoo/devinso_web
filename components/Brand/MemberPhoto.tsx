"use client";

import Image from "next/image";
import { useState } from "react";

type MemberPhotoProps = {
  src: string | null | undefined;
  alt: string;
  /** Rendered size in CSS px, so the optimiser serves a thumbnail, not the upload. */
  size: number;
  className?: string;
};

/**
 * A member's photo laid over its fallback. Callers render the initials in the
 * same box first; this sits on top and removes itself if the image fails.
 *
 * Without that, an upload the optimiser cannot fetch (media host down, file
 * removed) left a broken <img> filling the circle — no photo and no initials,
 * just an empty ring.
 */
export function MemberPhoto({ src, alt, size, className = "" }: MemberPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={`${size}px`}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
