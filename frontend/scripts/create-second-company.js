import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSecondCompany() {
  try {
    console.log("🏢 Création d'une deuxième compagnie d'assurance...");

    // Créer une deuxième compagnie
    const newCompany = await prisma.insuranceCompany.create({
      data: {
        name: "Assureur B",
        email: "contact@assureur-b.com",
        phone1: "+33 1 23 45 67 89",
        address: "123 Rue de la Paix, 75001 Paris",
        fiscalNumber: "FR12345678901",
        numberOfEmployees: 150,
        blockchainAddress: "0x2222222222222222222222222222222222222222",
        createdBy: "system",
        lastModifiedBy: "system",
      },
    });

    console.log(`✅ Compagnie créée: ${newCompany.name}`);
    console.log(`🔗 Adresse blockchain: ${newCompany.blockchainAddress}`);

    // Afficher toutes les compagnies
    const allCompanies = await prisma.insuranceCompany.findMany({
      select: {
        id: true,
        name: true,
        blockchainAddress: true,
      },
    });

    console.log("\n📊 Toutes les compagnies:");
    allCompanies.forEach((company, index) => {
      console.log(
        `  ${index + 1}. ${company.name}: ${company.blockchainAddress}`
      );
    });

    console.log("\n🧪 Maintenant vous pouvez tester la séparation:");
    console.log('1. Connectez-vous avec un utilisateur de "Assureur A"');
    console.log("2. Créez quelques cartes d'assurance");
    console.log('3. Connectez-vous avec un utilisateur de "Assureur B"');
    console.log('4. Vérifiez que vous ne voyez que les cartes de "Assureur B"');
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSecondCompany();
