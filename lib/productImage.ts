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
