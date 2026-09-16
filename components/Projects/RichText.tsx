/**
 * Renders a description text box.
 *
 * The box stores HTML, not plain text — `<strong>bold</strong>` is what the
 * admin editor produced and what should reach the reader as bold. React escapes
 * strings by default, so rendering it as text showed the tags themselves.
 *
 * Setting HTML here is safe because of where this content comes from: only an
 * authenticated admin can write a box, and the API sanitizes on every write
 * with an allow-list (`RichTextSanitizer`) that permits p, br, strong, em, u,
 * s, ul, ol, li and strips every attribute — which is what removes `onerror=`,
 * `href="javascript:"` and script content. Nothing a visitor supplies reaches
 * this component. The admin panel renders the same boxes the same way.
 *
 * A div rather than a p: the stored HTML can contain its own block tags, and a
 * <p> inside a <p> is invalid markup that the browser silently restructures.
 */
export function RichText({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`rich-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
