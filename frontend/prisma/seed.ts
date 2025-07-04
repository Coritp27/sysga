/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // Créer les rôles par défaut
  const roles = [
    {
      id: 1,
      name: "Administrateur",
      canRead: true,
      canWrite: true,
      permission: "FULL_ACCESS",
    },
    {
      id: 2,
      name: "Utilisateur Standard",
      canRead: true,
      canWrite: true,
      permission: "READ_WRITE",
    },
    {
      id: 3,
      name: "Lecteur",
      canRead: true,
      canWrite: false,
      permission: "READ_ONLY",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: role,
      create: role,
    });
    console.log(`✅ Rôle créé/mis à jour: ${role.name}`);
  }

  // Créer une compagnie d'assurance par défaut si elle n'existe pas
  const defaultCompany = await prisma.insuranceCompany.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "SYSGA Insurance",
      email: "contact@sysga.com",
      phone1: "+33 1 23 45 67 89",
      phone2: "+33 1 23 45 67 90",
      address: "123 Rue de la Paix, 75001 Paris, France",
      website: "https://www.sysga.com",
      fiscalNumber: "FR12345678901",
      numberOfEmployees: 100,
      blockchainAddress: "0x0000000000000000000000000000000000000000",
      createdBy: "system",
      lastModifiedBy: "system",
    },
  });
  console.log(
    `✅ Compagnie d'assurance créée/mise à jour: ${defaultCompany.name}`
  );

  // Créer une entreprise par défaut
  const defaultEnterprise = await prisma.enterprise.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Entreprise Test SYSGA",
      email: "contact@entreprise-test.com",
      phone1: "+33 1 98 76 54 32",
      phone2: "+33 1 98 76 54 33",
      address: "456 Avenue des Tests, 75002 Paris, France",
      website: "https://www.entreprise-test.com",
      fiscalNumber: "FR98765432109",
      numberOfEmployees: 50,
      insuranceCompanyId: defaultCompany.id,
      createdBy: "system",
      lastModifiedBy: "system",
    },
  });
  console.log(`✅ Entreprise créée/mise à jour: ${defaultEnterprise.name}`);

  // Créer des assurés de test
  const testInsuredPersons = [
    {
      firstName: "Jean",
      lastName: "Dupont",
      dateOfBirth: new Date("1985-03-15"),
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      address: "789 Rue des Assurés, 75003 Paris, France",
      gender: "M",
      cin: "CIN001",
      nif: "NIF001",
      hasDependent: true,
      numberOfDependent: 2,
      policyEffectiveDate: new Date("2024-01-01"),
      enterpriseId: defaultEnterprise.id,
    },
    {
      firstName: "Marie",
      lastName: "Martin",
      dateOfBirth: new Date("1990-07-22"),
      email: "marie.martin@email.com",
      phone: "+33 6 98 76 54 32",
      address: "321 Avenue des Tests, 75004 Paris, France",
      gender: "F",
      cin: "CIN002",
      nif: "NIF002",
      hasDependent: false,
      numberOfDependent: 0,
      policyEffectiveDate: new Date("2024-02-01"),
      enterpriseId: defaultEnterprise.id,
    },
    {
      firstName: "Pierre",
      lastName: "Bernard",
      dateOfBirth: new Date("1978-11-08"),
      email: "pierre.bernard@email.com",
      phone: "+33 6 55 44 33 22",
      address: "654 Boulevard des Assurés, 75005 Paris, France",
      gender: "M",
      cin: "CIN003",
      nif: "NIF003",
      hasDependent: true,
      numberOfDependent: 1,
      policyEffectiveDate: new Date("2024-03-01"),
      enterpriseId: defaultEnterprise.id,
    },
  ];

  for (const insuredPerson of testInsuredPersons) {
    await prisma.insuredPerson.upsert({
      where: { email: insuredPerson.email },
      update: insuredPerson,
      create: insuredPerson,
    });
    console.log(
      `✅ Assuré créé/mis à jour: ${insuredPerson.firstName} ${insuredPerson.lastName}`
    );
  }

  console.log("🎉 Seeding terminé avec succès!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
