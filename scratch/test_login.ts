import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function test() {
  const email = "admin@leaddesk.com";
  const password = "LeadDesk2025!";

  try {
    console.log("Looking up admin user...");
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser) {
      console.log("Admin user not found in database.");
      return;
    }
    console.log("Admin user found:", adminUser.email);
    console.log("Hash in database:", adminUser.passwordHash);

    console.log("Comparing password hash...");
    const matches = await bcrypt.compare(password, adminUser.passwordHash);
    console.log("Matches:", matches);
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
