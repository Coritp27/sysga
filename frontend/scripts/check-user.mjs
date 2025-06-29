import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log("🔍 Checking test user...");

    const user = await prisma.user.findFirst({
      where: { idClerk: "test_clerk_id" },
      include: {
        insuranceCompany: true,
        role: true,
      },
    });

    if (user) {
      console.log("✅ Test user found:");
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Username: ${user.username}`);
      console.log(`  - Company: ${user.insuranceCompany?.name}`);
      console.log(`  - Role: ${user.role?.name}`);
    } else {
      console.log("❌ Test user not found. Creating one...");

      // Get the first role and company
      const role = await prisma.role.findFirst();
      const company = await prisma.insuranceCompany.findFirst();

      if (role && company) {
        const newUser = await prisma.user.create({
          data: {
            username: "test@example.com",
            userType: "INSURER",
            idClerk: "test_clerk_id",
            roleId: role.id,
            insuranceCompanyId: company.id,
            createdBy: "system",
            lastModifiedBy: "system",
          },
        });

        console.log("✅ Test user created:", newUser.id);
      } else {
        console.log("❌ No role or company found");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
