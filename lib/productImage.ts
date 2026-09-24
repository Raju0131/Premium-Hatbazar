/**
 * Square logo thumbnail for a product image.
 *
 * Catalogue images bundled in public/products ship with a matching
 * "-icon.webp" crop of just the logo, which reads (and loads) far better in
 * the 34–64px thumbnails than the full banner. Any other URL, e.g. one pasted
 * in the admin, is used as-is.
 */
export function productIconUrl(imageUrl: string): string {
  return imageUrl.startsWith("/products/") ? imageUrl.replace(/\.webp$/, "-icon.webp") : imageUrl;
}

/**
 * srcSet for a bundled catalogue banner: public/products ships "-640" and
 * "-960" copies next to the 1280px original, so each device downloads only the
 * size it displays. Other URLs get no srcSet.
 */
export function productImageSrcSet(imageUrl: string): string | undefined {
  if (!imageUrl.startsWith("/products/")) return undefined;
  const base = imageUrl.replace(/\.webp$/, "");
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${imageUrl} 1280w`;
}
