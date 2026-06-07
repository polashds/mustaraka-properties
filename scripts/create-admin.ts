import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const email = process.env.ADMIN_EMAIL ?? "admin@mustarakaproperties.com";
const password = process.env.ADMIN_PASSWORD ?? "Admin@2026!";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: { hashedPassword },
      create: { email, hashedPassword, role: "ADMIN" },
    });

    console.log("✓ Admin user ready:");
    console.log("  Email   :", user.email);
    console.log("  Password:", password);
    console.log("  Role    :", user.role);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
