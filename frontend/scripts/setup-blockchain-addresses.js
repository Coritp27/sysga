const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function setupBlockchainAddresses() {
  try {
    console.log(
      "🔧 Configuration des adresses blockchain pour les compagnies d'assurance..."
    );

    // Récupérer toutes les compagnies d'assurance
    const companies = await prisma.insuranceCompany.findMany({
      where: {
        blockchainAddress: null, // Seulement celles sans adresse blockchain
      },
    });

    console.log(
      `📋 ${companies.length} compagnie(s) trouvée(s) sans adresse blockchain`
    );

    if (companies.length === 0) {
      console.log(
        "✅ Toutes les compagnies ont déjà une adresse blockchain configurée"
      );
      return;
    }

    // Adresses de test pour les compagnies
    const testAddresses = [
      "0x1234567890123456789012345678901234567890", // Compagnie A
      "0x2345678901234567890123456789012345678901", // Compagnie B
      "0x3456789012345678901234567890123456789012", // Compagnie C
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
    updatedCompanies.forEach((company) => {
      console.log(
        `  - ${company.name}: ${company.blockchainAddress || "Non configurée"}`
      );
    });
  } catch (error) {
    console.error("❌ Erreur lors de la configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
setupBlockchainAddresses();
