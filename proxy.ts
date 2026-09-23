import { NextRequest, NextResponse } from "next/server";

/**
 * Protects /admin with HTTP Basic Auth ONLY when ADMIN_PASSWORD is set.
 * If it is unset (e.g. local dev) the admin stays open. Set ADMIN_PASSWORD
 * (and optionally ADMIN_USER, default "admin") before deploying.
 */
export function proxy(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return NextResponse.next();

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === (process.env.ADMIN_USER || "admin") && pass === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("প্রবেশাধিকার প্রয়োজন", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Premium Hatbazar Admin"' },
  });
}

export const config = { matcher: ["/admin/:path*"] };
