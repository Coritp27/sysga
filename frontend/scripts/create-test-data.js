import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log("🔧 Création de données de test...");

    // Créer une compagnie d'assurance
    const insuranceCompany = await prisma.insuranceCompany.upsert({
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
    console.log("✅ Compagnie d'assurance:", insuranceCompany.name);

    // Créer des entreprises
    const enterprises = [
      {
        name: "Entreprise Alpha",
        email: "contact@alpha.com",
        phone1: "+33 1 11 11 11 11",
        address: "456 Rue Alpha, 75002 Paris",
        fiscalNumber: "FR11111111111",
        numberOfEmployees: 25,
      },
      {
        name: "Entreprise Beta",
        email: "contact@beta.com",
        phone1: "+33 1 22 22 22 22",
        address: "789 Rue Beta, 75003 Paris",
        fiscalNumber: "FR22222222222",
        numberOfEmployees: 50,
      },
    ];

    const createdEnterprises = [];
    for (const enterpriseData of enterprises) {
      const enterprise = await prisma.enterprise.upsert({
        where: { name: enterpriseData.name },
        update: {},
        create: {
          ...enterpriseData,
          createdBy: "system",
          lastModifiedBy: "system",
        },
      });
      createdEnterprises.push(enterprise);
      console.log("✅ Entreprise créée:", enterprise.name);
    }

    // Créer des assurés liés aux entreprises
    const insuredPersons = [
      {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: new Date("1985-03-15"),
        email: "jean.dupont@email.com",
        phone: "+33 6 12 34 56 78",
        address: "123 Rue des Assurés, 75001 Paris",
        gender: "M",
        cin: "CIN001",
        nif: "NIF001",
        hasDependent: true,
        numberOfDependent: 2,
        policyEffectiveDate: new Date("2024-01-01"),
        enterpriseId: createdEnterprises[0].id,
      },
      {
        firstName: "Marie",
        lastName: "Martin",
        dateOfBirth: new Date("1990-07-22"),
        email: "marie.martin@email.com",
        phone: "+33 6 98 76 54 32",
        address: "456 Avenue des Tests, 75002 Paris",
        gender: "F",
        cin: "CIN002",
        nif: "NIF002",
        hasDependent: false,
        numberOfDependent: 0,
        policyEffectiveDate: new Date("2024-02-01"),
        enterpriseId: createdEnterprises[0].id,
      },
      {
        firstName: "Pierre",
        lastName: "Bernard",
        dateOfBirth: new Date("1978-11-08"),
        email: "pierre.bernard@email.com",
        phone: "+33 6 55 44 33 22",
        address: "789 Boulevard des Assurés, 75003 Paris",
        gender: "M",
        cin: "CIN003",
        nif: "NIF003",
        hasDependent: true,
        numberOfDependent: 1,
        policyEffectiveDate: new Date("2024-03-01"),
        enterpriseId: createdEnterprises[1].id,
      },
      {
        firstName: "Sophie",
        lastName: "Leroy",
        dateOfBirth: new Date("1992-05-14"),
        email: "sophie.leroy@email.com",
        phone: "+33 6 77 88 99 00",
        address: "321 Rue Sophie, 75004 Paris",
        gender: "F",
        cin: "CIN004",
        nif: "NIF004",
        hasDependent: false,
        numberOfDependent: 0,
        policyEffectiveDate: new Date("2024-04-01"),
        enterpriseId: null, // Sans entreprise
      },
    ];

    for (const insuredPerson of insuredPersons) {
      await prisma.insuredPerson.upsert({
        where: { email: insuredPerson.email },
        update: insuredPerson,
        create: insuredPerson,
      });
      console.log(
        `✅ Assuré créé: ${insuredPerson.firstName} ${insuredPerson.lastName}`
      );
    }

    // Vérifier les données créées
    const totalInsured = await prisma.insuredPerson.count();
    const totalEnterprises = await prisma.enterprise.count();
    const totalCompanies = await prisma.insuranceCompany.count();

    console.log("\n📊 Statistiques finales:");
    console.log(`- Total assurés: ${totalInsured}`);
    console.log(`- Total entreprises: ${totalEnterprises}`);
    console.log(`- Total compagnies d'assurance: ${totalCompanies}`);

    console.log("\n🎉 Données de test créées avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
