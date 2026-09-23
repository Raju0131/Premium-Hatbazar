import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

/**
 * Neon serverless driver tunnels Postgres over HTTPS/443 instead of raw TCP 5432:
 *  - queries go over HTTP fetch (poolQueryViaFetch)
 *  - transactions go over a WebSocket (needs an explicit constructor on Node < 22)
 * This works on restricted networks (mobile hotspots, firewalls that block 5432)
 * and on Vercel's serverless runtime — the recommended setup for Neon.
 *
 * One shared client on globalThis avoids connection churn in dev hot-reload.
 */
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
