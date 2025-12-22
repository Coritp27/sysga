// Usage: node frontend/scripts/find-user.js <username|idClerk>
// Example: node frontend/scripts/find-user.js medical@vericarte.com

require("dotenv").config({ path: "./.env" });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node find-user.js <username|idClerk>");
    process.exit(1);
  }

  // Try to find by username first, then by idClerk
  let user = await prisma.user.findFirst({
    where: { username: arg, isDeleted: false },
  });
  if (!user) {
    user = await prisma.user.findFirst({
      where: { idClerk: arg, isDeleted: false },
    });
  }

  if (!user) {
    console.log(`User not found for '${arg}'.`);
    process.exit(0);
  }

  console.log("User found:");
  // Print only key fields
  const out = {
    id: user.id,
    username: user.username,
    idClerk: user.idClerk,
    userType: user.userType,
    insuranceCompanyId: user.insuranceCompanyId,
    createdAt: user.createdAt,
    isDeleted: user.isDeleted,
  };
  console.log(JSON.stringify(out, null, 2));
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
