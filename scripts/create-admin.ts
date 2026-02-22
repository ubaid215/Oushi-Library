import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createAdmin() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   Oushi Books — Create Admin User    ║");
  console.log("╚══════════════════════════════════════╝\n");

  try {
    const name = await prompt("Full Name: ");
    const email = await prompt("Email: ");
    const password = await prompt("Password (min 8 chars): ", true);
    const confirmPassword = await prompt("Confirm Password: ", true);
    const roleInput = await prompt(
      "Role [SUPER_ADMIN/ADMIN/EDITOR/VIEWER] (default: SUPER_ADMIN): "
    );

    // Validate
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email address.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const role: AdminRole = (
      ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"].includes(
        roleInput.toUpperCase()
      )
        ? roleInput.toUpperCase()
        : "SUPER_ADMIN"
    ) as AdminRole;

    // Check existing
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error(`Admin with email "${email}" already exists.`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.adminUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: new Date(),
      },
    });

    console.log("\n✅ Admin created successfully!");
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ${admin.role}`);
    console.log("\n🔐 You can now log in at /admin/login\n");
  } catch (err) {
    console.error("\n❌ Error:", (err as Error).message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
