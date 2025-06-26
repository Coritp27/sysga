/// <reference types="node" />

import {
  PrismaClient,
  UserType,
  InsuranceCardStatus,
  PolicyType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données d'abord
  await prisma.blockchainReference.deleteMany();
  await prisma.insuranceCard.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.user.deleteMany();
  await prisma.insuredPerson.deleteMany();
  await prisma.enterprise.deleteMany();
  await prisma.insuranceCompany.deleteMany();
  await prisma.role.deleteMany();

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

  // Créer un utilisateur avec une compagnie d'assurance
  const user = await prisma.user.create({
    data: {
      username: "user_test",
      userType: UserType.INSURER,
      idKeycloak: "test_user_id",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      insuranceCompanyId: insuranceCompany.id,
      roleId: adminRole.id,
      createdBy: "system",
      lastModifiedBy: "system",
    },
  });

  // Recréer la police et la carte d'assurance pour la référence blockchain

  await prisma.blockchainReference.create({
    data: {
      reference: BigInt("123456789"),
      cardNumber: "CARD001",
      blockchainTxHash:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
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

  console.log("Seed terminé avec succès!");
  console.log("Compagnie d'assurance créée:", insuranceCompany.name);
  console.log("Utilisateur créé:", user.username);
  console.log("Utilisateur lié à la compagnie:", insuranceCompany.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
