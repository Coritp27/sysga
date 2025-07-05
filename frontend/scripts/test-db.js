import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("🔍 Test de connexion à la base de données...");

    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");

    // Compter les cartes d'assurance
    const totalCards = await prisma.insuranceCard.count();
    console.log("📊 Total cartes d'assurance:", totalCards);

    // Compter les références blockchain
    const totalReferences = await prisma.blockchainReference.count();
    console.log("🔗 Total références blockchain:", totalReferences);

    // Compter les utilisateurs
    const totalUsers = await prisma.user.count();
    console.log("👥 Total utilisateurs:", totalUsers);

    // Compter les compagnies d'assurance
    const totalCompanies = await prisma.insuranceCompany.count();
    console.log("🏢 Total compagnies d'assurance:", totalCompanies);

    console.log("✅ Tous les tests de base de données réussis");
  } catch (error) {
    console.error("❌ Erreur lors du test de la base de données:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
