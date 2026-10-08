type ProfileWatermarkProps = {
  text: string;
  /** `hero` sits beside the header; `section` sits behind a section title. */
  variant: "hero" | "section";
};

/**
 * Oversized decorative lettering behind a profile block. Drawn as a hairline
 * outline in the member's accent and faded out towards the bottom, so it reads
 * as texture rather than as text competing with the content in front of it.
 * Size and placement live in `.profile-watermark` (app/globals.css).
 */
export function ProfileWatermark({ text, variant }: ProfileWatermarkProps) {
  return (
    <div aria-hidden="true" lang="en" className={`profile-watermark profile-watermark--${variant}`}>
      {text}
    </div>
  );
}
