

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
