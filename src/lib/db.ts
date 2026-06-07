import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let _client: PrismaClient | undefined;

function getClient(): PrismaClient {
  if (!_client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    _client = new PrismaClient({ adapter: new PrismaPg(url) });
  }
  return _client;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Proxy so importing this module never instantiates the client — first actual
// query call triggers getClient(), which is safe at request time.
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new Proxy({} as PrismaClient, {
    get(_t, prop) {
      return (getClient() as any)[prop];
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
