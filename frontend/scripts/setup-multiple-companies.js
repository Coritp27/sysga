import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setupMultipleCompanies() {
  try {
    console.log("🏢 Configuration de plusieurs compagnies d'assurance...");

    // Récupérer toutes les compagnies d'assurance
    const companies = await prisma.insuranceCompany.findMany();

    console.log(`📋 ${companies.length} compagnie(s) trouvée(s)`);

    if (companies.length === 0) {
      console.log("❌ Aucune compagnie d'assurance trouvée");
      return;
    }

    // Adresses de test pour différentes compagnies
    const testAddresses = [
      "0x1111111111111111111111111111111111111111", // Compagnie 1
      "0x2222222222222222222222222222222222222222", // Compagnie 2
      "0x3333333333333333333333333333333333333333", // Compagnie 3
      "0x4444444444444444444444444444444444444444", // Compagnie 4
      "0x5555555555555555555555555555555555555555", // Compagnie 5
    ];

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const blockchainAddress =
        testAddresses[i] || `0x${Math.random().toString(16).substr(2, 40)}`;

      console.log(
        `🔗 Configuration de ${company.name} avec l'adresse: ${blockchainAddress}`
      );

      await prisma.insuranceCompany.update({
        where: { id: company.id },
        data: {
          blockchainAddress,
          lastModifiedBy: "system",
        },
      });
    }

    console.log("✅ Configuration terminée avec succès !");

    // Afficher le résumé
    const updatedCompanies = await prisma.insuranceCompany.findMany({
      select: {
        id: true,
        name: true,
        blockchainAddress: true,
      },
    });

    console.log("\n📊 Résumé des compagnies configurées:");
    updatedCompanies.forEach((company, index) => {
      console.log(
        `  ${index + 1}. ${company.name}: ${company.blockchainAddress || "Non configurée"}`
      );
    });

    console.log("\n🧪 Instructions de test:");
    console.log("1. Connectez-vous avec un utilisateur de la Compagnie 1");
    console.log("2. Créez quelques cartes d'assurance");
    console.log("3. Connectez-vous avec un utilisateur de la Compagnie 2");
    console.log(
      "4. Vérifiez que vous ne voyez que les cartes de la Compagnie 2"
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupMultipleCompanies();
