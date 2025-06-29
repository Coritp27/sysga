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
