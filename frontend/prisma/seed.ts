/// <reference types="node" />

import {
  PrismaClient,
  UserType,
  InsuranceCardStatus,
  PolicyType,
} from "@prisma/client";

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
      email: "contact@assureur-a.com",
      phone1: "0123456789",
      phone2: "0987654321",
      address: "123 rue de l'assurance",
      website: "www.assureur-a.com",
      fiscalNumber: "FR123456789",
      numberOfEmployees: 150,
    },
  });

  const enterprise = await prisma.enterprise.create({
    data: {
      name: "Entreprise Test",
      email: "contact@entreprise-test.com",
      phone1: "0123456789",
      phone2: "0987654321",
      address: "456 rue de l'entreprise",
      website: "www.entreprise-test.com",
      fiscalNumber: "FR987654321",
      numberOfEmployees: 50,
      createdBy: "system",
      lastModifiedBy: "system",
    },
  });

  const insuredPerson = await prisma.insuredPerson.create({
    data: {
      // Person fields
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      email: "john.doe@email.com",
      phone: "0123456789",
      address: "789 rue de la personne",
      gender: "M",
      // InsuredPerson specific fields
      cin: "CIN123456",
      nif: "NIF654321",
      hasDependent: true,
      numberOfDependent: 2,
      policyEffectiveDate: new Date(),
      enterpriseId: enterprise.id,
    },
  });

  await prisma.insuranceCard.create({
    data: {
      insuredPersonName: "John Doe",
      policyNumber: BigInt("1001"),
      cardNumber: "CARD123456",
      dateOfBirth: new Date("1990-01-01"),
      policyEffectiveDate: new Date(),
      hadDependent: true,
      status: InsuranceCardStatus.ACTIVE,
      validUntil: new Date("2025-12-31"),
      insuranceCompanyId: insuranceCompany.id,
      insuredPersonId: insuredPerson.id,
    },
  });

  await prisma.policy.create({
    data: {
      policyNumber: BigInt("1001"),
      type: PolicyType.INDIVIDUAL,
      coverage: "Standard",
      deductible: 100.0,
      premiumAmount: 500.0,
      description: "Police santé standard",
      validUntil: new Date("2025-12-31"),
      insuranceCompanyId: insuranceCompany.id,
    },
  });

  await prisma.blockchainReference.create({
    data: {
      reference: BigInt("123456789"),
      cardNumber: "CARD123456",
      blockchainTxHash: "txhash123456",
    },
  });

  await prisma.medicalInstitution.create({
    data: {
      name: "Clinique Y",
      email: "contact@clinique-y.com",
      phone1: "0123456789",
      phone2: "0987654321",
      address: "321 rue de la santé",
      website: "www.clinique-y.com",
      fiscalNumber: "FR111222333",
      numberOfEmployees: 25,
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
