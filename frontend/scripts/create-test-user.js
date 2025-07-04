import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log("🔧 Création d'un utilisateur de test...");

    // Récupérer la compagnie d'assurance existante
    const insuranceCompany = await prisma.insuranceCompany.findFirst({
      where: { name: "SYSGA Insurance" },
    });

    if (!insuranceCompany) {
      console.error("❌ Aucune compagnie d'assurance trouvée");
      return;
    }

    console.log("🏢 Compagnie trouvée:", insuranceCompany.name);

    // Créer un utilisateur de test
    const testUser = await prisma.user.upsert({
      where: { idClerk: "test_user_clerk_id" },
      update: {
        insuranceCompanyId: insuranceCompany.id,
      },
      create: {
        username: "test_user",
        userType: "INSURER",
        idClerk: "test_user_clerk_id",
        walletAddress: "0x1234567890123456789012345678901234567890",
        insuranceCompanyId: insuranceCompany.id,
        isActive: true,
        roleId: 1, // Administrateur
        createdBy: "system",
        lastModifiedBy: "system",
      },
    });

    console.log("✅ Utilisateur de test créé:", {
      id: testUser.id,
      username: testUser.username,
      insuranceCompanyId: testUser.insuranceCompanyId,
    });

    // Vérifier les assurés disponibles
    const insuredPersons = await prisma.insuredPerson.findMany({
      include: {
        enterprise: {
          include: {
            insuranceCompany: true,
          },
        },
      },
    });

    console.log("📊 Assurés disponibles:");
    insuredPersons.forEach((person) => {
      console.log(`- ${person.firstName} ${person.lastName} (${person.email})`);
      console.log(`  Entreprise: ${person.enterprise?.name || "Aucune"}`);
      console.log(
        `  Compagnie: ${person.enterprise?.insuranceCompany?.name || "Aucune"}`
      );
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
