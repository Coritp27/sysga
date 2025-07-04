import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestPolicies() {
  try {
    console.log("🔧 Création de polices de test...");

    // Récupérer la compagnie d'assurance existante
    const insuranceCompany = await prisma.insuranceCompany.findFirst({
      where: { name: "SYSGA Insurance" },
    });

    if (!insuranceCompany) {
      console.error("❌ Aucune compagnie d'assurance trouvée");
      return;
    }

    console.log("🏢 Compagnie trouvée:", insuranceCompany.name);

    // Créer des polices de test
    const testPolicies = [
      {
        policyNumber: 1001,
        type: "INDIVIDUAL",
        coverage: "Couverture complète santé et accident",
        deductible: 100.0,
        premiumAmount: 150.0,
        description: "Police individuelle avec couverture santé complète",
        validUntil: new Date("2025-12-31"),
        insuranceCompanyId: insuranceCompany.id,
      },
      {
        policyNumber: 1002,
        type: "FAMILY",
        coverage: "Couverture familiale santé et prévention",
        deductible: 200.0,
        premiumAmount: 250.0,
        description: "Police familiale avec couverture étendue",
        validUntil: new Date("2025-12-31"),
        insuranceCompanyId: insuranceCompany.id,
      },
      {
        policyNumber: 1003,
        type: "GROUP",
        coverage: "Couverture groupe entreprise",
        deductible: 150.0,
        premiumAmount: 180.0,
        description: "Police de groupe pour entreprises",
        validUntil: new Date("2025-12-31"),
        insuranceCompanyId: insuranceCompany.id,
      },
      {
        policyNumber: 1004,
        type: "ENTERPRISE",
        coverage: "Couverture entreprise complète",
        deductible: 500.0,
        premiumAmount: 600.0,
        description: "Police entreprise avec couverture maximale",
        validUntil: new Date("2025-12-31"),
        insuranceCompanyId: insuranceCompany.id,
      },
    ];

    for (const policyData of testPolicies) {
      await prisma.policy.upsert({
        where: {
          policyNumber_insuranceCompanyId: {
            policyNumber: policyData.policyNumber,
            insuranceCompanyId: policyData.insuranceCompanyId,
          },
        },
        update: policyData,
        create: policyData,
      });
      console.log(
        `✅ Police créée: #${policyData.policyNumber} - ${policyData.type}`
      );
    }

    // Vérifier les données créées
    const totalPolicies = await prisma.policy.count();
    const totalCompanies = await prisma.insuranceCompany.count();

    console.log("\n📊 Statistiques finales:");
    console.log(`- Total polices: ${totalPolicies}`);
    console.log(`- Total compagnies d'assurance: ${totalCompanies}`);

    // Afficher toutes les polices
    const allPolicies = await prisma.policy.findMany({
      include: {
        insuranceCompany: true,
      },
    });

    console.log("\n📋 Polices disponibles:");
    allPolicies.forEach((policy) => {
      console.log(`- Police #${policy.policyNumber} (${policy.type})`);
      console.log(`  Couverture: ${policy.coverage}`);
      console.log(`  Prime: ${policy.premiumAmount}€`);
      console.log(`  Compagnie: ${policy.insuranceCompany.name}`);
    });

    console.log("\n🎉 Polices de test créées avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPolicies();
