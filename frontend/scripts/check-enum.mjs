import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkEnum() {
  try {
    console.log("🔍 Checking PolicyType enum in database...");

    // Try to create a policy with each type to see which ones work
    const testTypes = ["INDIVIDUAL", "FAMILY", "GROUP", "ENTERPRISE"];

    for (const type of testTypes) {
      try {
        console.log(`Testing type: ${type}`);

        // Get first user with company
        const user = await prisma.user.findFirst({
          where: { insuranceCompanyId: { not: null } },
        });

        if (!user?.insuranceCompanyId) {
          console.log("❌ No user with company found");
          break;
        }

        // Try to create a test policy
        const testPolicy = await prisma.policy.create({
          data: {
            policyNumber: Math.floor(Math.random() * 100000),
            type: type,
            coverage: `Test ${type}`,
            deductible: 100.0,
            premiumAmount: 500.0,
            description: `Test policy for ${type}`,
            validUntil: new Date("2025-12-31"),
            insuranceCompanyId: user.insuranceCompanyId,
          },
        });

        console.log(`✅ ${type} works! Created policy ID: ${testPolicy.id}`);

        // Clean up
        await prisma.policy.delete({
          where: { id: testPolicy.id },
        });
      } catch (error) {
        console.log(`❌ ${type} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnum();
