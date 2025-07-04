import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestInsuranceCards() {
  try {
    console.log("🚀 Création des cartes d'assurance de test...");

    // Récupérer la première compagnie d'assurance
    const insuranceCompany = await prisma.insuranceCompany.findFirst();
    if (!insuranceCompany) {
      console.log(
        "❌ Aucune compagnie d'assurance trouvée. Création d'une compagnie de test..."
      );
      const newCompany = await prisma.insuranceCompany.create({
        data: {
          name: "Compagnie de Test",
          email: "test@assurance.com",
          phone1: "+33 1 23 45 67 89",
          phone2: "",
          address: "1 rue de test, 75000 Paris, France",
          website: "https://test-assurance.com",
          fiscalNumber: "FR12345678901",
          numberOfEmployees: 10,
          blockchainAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          createdBy: "script",
          lastModifiedBy: "script",
        },
      });
      console.log("✅ Compagnie créée:", newCompany.name);
    }

    // Récupérer la première personne assurée
    const insuredPerson = await prisma.insuredPerson.findFirst();
    if (!insuredPerson) {
      console.log(
        "❌ Aucune personne assurée trouvée. Création d'une personne de test..."
      );
      const newPerson = await prisma.insuredPerson.create({
        data: {
          firstName: "Jean",
          lastName: "Dupont",
          dateOfBirth: new Date("1990-01-15"),
          email: "jean.dupont@email.com",
          phone: "+33 6 12 34 56 78",
          address: "123 rue de la Paix, 75001 Paris",
          gender: "M",
          cin: "CIN123456",
          nif: "NIF789012",
          hasDependent: true,
          numberOfDependent: 2,
          policyEffectiveDate: new Date("2024-01-01"),
          createdBy: "script",
          lastModifiedBy: "script",
        },
      });
      console.log(
        "✅ Personne assurée créée:",
        `${newPerson.firstName} ${newPerson.lastName}`
      );
    }

    // Récupérer les données nécessaires
    const company = await prisma.insuranceCompany.findFirst();
    const person = await prisma.insuredPerson.findFirst();

    if (!company || !person) {
      console.log(
        "❌ Impossible de créer les cartes sans compagnie ou personne assurée"
      );
      return;
    }

    // Créer plusieurs cartes d'assurance de test
    const testCards = [
      {
        insuredPersonName: `${person.firstName} ${person.lastName}`,
        policyNumber: BigInt(1001),
        cardNumber: "CARD-2024-001",
        dateOfBirth: new Date("1990-01-15"),
        policyEffectiveDate: new Date("2024-01-01"),
        hadDependent: true,
        status: "ACTIVE",
        validUntil: new Date("2025-01-01"),
        insuranceCompanyId: company.id,
        insuredPersonId: person.id,
        blockchainReference: {
          reference: BigInt(1001),
          blockchainTxHash:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      },
      {
        insuredPersonName: `${person.firstName} ${person.lastName}`,
        policyNumber: BigInt(1002),
        cardNumber: "CARD-2024-002",
        dateOfBirth: new Date("1990-01-15"),
        policyEffectiveDate: new Date("2024-02-01"),
        hadDependent: false,
        status: "ACTIVE",
        validUntil: new Date("2025-02-01"),
        insuranceCompanyId: company.id,
        insuredPersonId: person.id,
        blockchainReference: {
          reference: BigInt(1002),
          blockchainTxHash:
            "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        },
      },
      {
        insuredPersonName: `${person.firstName} ${person.lastName}`,
        policyNumber: BigInt(1003),
        cardNumber: "CARD-2024-003",
        dateOfBirth: new Date("1990-01-15"),
        policyEffectiveDate: new Date("2024-03-01"),
        hadDependent: true,
        status: "INACTIVE",
        validUntil: new Date("2025-03-01"),
        insuranceCompanyId: company.id,
        insuredPersonId: person.id,
        blockchainReference: {
          reference: BigInt(1003),
          blockchainTxHash:
            "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        },
      },
    ];

    for (const cardData of testCards) {
      const { blockchainReference, ...cardDataWithoutRef } = cardData;

      // Créer la carte d'assurance
      const insuranceCard = await prisma.insuranceCard.create({
        data: cardDataWithoutRef,
      });

      console.log(`✅ Carte créée: ${insuranceCard.cardNumber}`);

      // Créer la référence blockchain
      if (blockchainReference) {
        const blockchainRef = await prisma.blockchainReference.create({
          data: {
            reference: blockchainReference.reference,
            cardNumber: insuranceCard.cardNumber,
            blockchainTxHash: blockchainReference.blockchainTxHash,
          },
        });

        console.log(
          `✅ Référence blockchain créée: #${blockchainRef.reference}`
        );
      }
    }

    console.log("🎉 Création des cartes d'assurance terminée !");

    // Afficher les statistiques
    const totalCards = await prisma.insuranceCard.count();
    const totalReferences = await prisma.blockchainReference.count();

    console.log(`📊 Statistiques:`);
    console.log(`   - Cartes d'assurance: ${totalCards}`);
    console.log(`   - Références blockchain: ${totalReferences}`);
  } catch (error) {
    console.error("❌ Erreur lors de la création des cartes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createTestInsuranceCards();
