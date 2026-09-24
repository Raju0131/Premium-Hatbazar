/**
 * HTTP Basic Auth check for the admin, shared by proxy.ts and the admin server
 * actions. It fails closed: without ADMIN_PASSWORD nobody gets in, so a
 * deployment that is missing the variable (a Vercel preview, say) never exposes
 * customer data.
 */
export function isAdminRequest(authorization: string | null): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(authorization.slice(6));
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return false;
  return (
    decoded.slice(0, sep) === (process.env.ADMIN_USER || "admin") &&
    decoded.slice(sep + 1) === password
  );
}
