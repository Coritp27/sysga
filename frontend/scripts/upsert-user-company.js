// Usage: node frontend/scripts/upsert-user-company.js <username|idClerk> <insuranceCompanyId>
// Example: node frontend/scripts/upsert-user-company.js medical@vericarte.com 1

require('dotenv').config({ path: './.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const target = process.argv[2];
  const companyIdArg = process.argv[3];
  if (!target || !companyIdArg) {
    console.error('Usage: node upsert-user-company.js <username|idClerk> <insuranceCompanyId>');
    process.exit(1);
  }
  const insuranceCompanyId = Number(companyIdArg);
  if (isNaN(insuranceCompanyId) || insuranceCompanyId <= 0) {
    console.error('insuranceCompanyId must be a positive number');
    process.exit(1);
  }

  // Try find by username then idClerk
  let user = await prisma.user.findFirst({ where: { username: target, isDeleted: false } });
  if (!user) {
    user = await prisma.user.findFirst({ where: { idClerk: target, isDeleted: false } });
  }

  if (!user) {
    console.log(`User not found for '${target}'. Creating a minimal user record linked to company ${insuranceCompanyId}.`);
    // Minimal create: username=target if it's an email-like string, otherwise idClerk set and username fallback
    const isEmail = /@/.test(target);
    const data = {
      username: isEmail ? target : `user_${Date.now()}`,
      userType: 'MEDICAL',
      idClerk: isEmail ? `clerk_${Date.now()}` : target,
      insuranceCompanyId,
      roleId: 1, // you may need to adapt roleId to a valid role in your DB
      createdBy: 'script',
      lastModifiedBy: 'script'
    };
    const created = await prisma.user.create({ data });
    console.log('Created user:', { id: created.id, username: created.username, idClerk: created.idClerk, insuranceCompanyId: created.insuranceCompanyId });
    process.exit(0);
  }

  // Update existing user to set insuranceCompanyId
  const updated = await prisma.user.update({ where: { id: user.id }, data: { insuranceCompanyId, lastModifiedBy: 'script' } });
  console.log('Updated user:', { id: updated.id, username: updated.username, idClerk: updated.idClerk, insuranceCompanyId: updated.insuranceCompanyId });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
