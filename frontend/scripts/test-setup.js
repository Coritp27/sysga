import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testSetup() {
  try {
    console.log("🧪 Configuration de test pour les adresses blockchain...");

    // Récupérer la première compagnie d'assurance
    const company = await prisma.insuranceCompany.findFirst();

    if (!company) {
      console.log("❌ Aucune compagnie d'assurance trouvée");
      return;
    }

    console.log(`📋 Compagnie trouvée: ${company.name}`);

    // Adresse de test
    const testAddress = "0x1234567890123456789012345678901234567890";

    // Mettre à jour avec l'adresse blockchain
    await prisma.insuranceCompany.update({
      where: { id: company.id },
      data: {
        blockchainAddress: testAddress,
        lastModifiedBy: "system",
      },
    });

    console.log(`✅ Adresse blockchain configurée: ${testAddress}`);

    // Vérifier la mise à jour
    const updatedCompany = await prisma.insuranceCompany.findUnique({
      where: { id: company.id },
    });

    console.log("📊 Compagnie mise à jour:", {
      id: updatedCompany.id,
      name: updatedCompany.name,
      blockchainAddress: updatedCompany.blockchainAddress,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSetup();
