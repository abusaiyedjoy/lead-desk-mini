/**
 * prisma/seed-admin.ts
 *
 * Creates (or updates) the admin user with a bcrypt-hashed password.
 * Uses upsert so it's safe to run multiple times — will not create duplicates.
 *
 * Usage:
 *   npx tsx prisma/seed-admin.ts
 *
 * Or via npm script:
 *   npm run seed:admin
 *
 * Environment variables required:
 *   ADMIN_EMAIL    - Admin email address (default: admin@leaddesk.com)
 *   ADMIN_PASSWORD - Admin plain-text password to hash (default: LeadDesk2025!)
 */

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@leaddesk.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "LeadDesk2025!";

async function main() {
  console.log("🔐 Seeding admin user...");
  console.log(`   Email: ${ADMIN_EMAIL}`);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
    },
  });

  console.log(`✅  Admin user ready: ${adminUser.email} (id: ${adminUser.id})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ seed-admin failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
