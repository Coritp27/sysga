/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      canRead: true,
      canWrite: true,
      permission: "ALL",
    },
  });
  const insuranceCompany = await prisma.insuranceCompany.create({
    data: {
      name: "Assureur A",
    },
  });

  const user = await prisma.user.create({
    data: {
      username: "johndoe",
      idKeycloak: "keycloak-123",
      institutionId: 1,
      roleId: adminRole.id,
    },
  });

  const insuredPerson = await prisma.insuredPerson.create({
    data: {
      cin: "CIN123456",
      nif: "NIF654321",
      numberOfDependent: 2,
      policyEffectiveDate: new Date(),
      merkleRoot: "root123",
      blockchainTxHash: "txhash123",
      merkleGeneratedAt: new Date(),
      userId: user.id,
    },
  });

  await prisma.insuranceCard.create({
    data: {
      cardNumber: "CARD123",
      issuedOn: new Date(),
      status: "active",
      insuranceCompanyId: insuranceCompany.id,
      insuredPersonId: insuredPerson.id,
    },
  });

  await prisma.policy.create({
    data: {
      policyNumber: 1001,
      type: "Santé",
      coverage: "Standard",
      deductible: 100.0,
      premium: 500,
      description: "Police santé standard",
      insuranceCompanyId: insuranceCompany.id,
    },
  });

  await prisma.blockchain_reference.create({
    data: {
      insuredPersonId: insuredPerson.id,
      merkleRoot: "root123",
      blockchainTxHash: "txhash123",
      createdAt: new Date(),
    },
  });

  await prisma.organization.create({
    data: {
      name: "Organisation X",
      email: "orgx@email.com",
      phone1: "0123456789",
      phone2: "0987654321",
      adresse: "123 rue principale",
      website: "www.orgx.com",
      fiscalNumber: 123456,
      numberOfEmployee: 50,
    },
  });

  await prisma.medicalInstitution.create({
    data: {
      name: "Clinique Y",
    },
  });

  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
