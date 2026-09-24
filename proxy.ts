import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

/**
 * Protects /admin with HTTP Basic Auth (user ADMIN_USER, default "admin";
 * password ADMIN_PASSWORD). Fails closed: if ADMIN_PASSWORD is not set, the
 * admin is locked for everyone rather than left open.
 */
export function proxy(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return new NextResponse("অ্যাডমিন বন্ধ: ADMIN_PASSWORD সেট করা নেই।", { status: 503 });
  }

  if (isAdminRequest(req.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new NextResponse("প্রবেশাধিকার প্রয়োজন", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Premium Hatbazar Admin"' },
  });
}

export const config = { matcher: ["/admin/:path*"] };
