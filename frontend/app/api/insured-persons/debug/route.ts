import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// GET - Debug endpoint pour voir toutes les données
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findFirst({
      where: { idClerk: userId, isDeleted: false },
      include: {
        insuranceCompany: true,
      },
    });

    console.log("👤 Utilisateur:", {
      id: user?.id,
      insuranceCompanyId: user?.insuranceCompanyId,
      insuranceCompany: user?.insuranceCompany?.name,
    });

    // Récupérer TOUS les assurés (sans filtres)
    const allInsuredPersons = await prisma.insuredPerson.findMany({
      include: {
        enterprise: {
          include: {
            insuranceCompany: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // Récupérer toutes les entreprises
    const allEnterprises = await prisma.enterprise.findMany({
      include: {
        insuranceCompany: true,
      },
    });

    // Récupérer toutes les compagnies d'assurance
    const allInsuranceCompanies = await prisma.insuranceCompany.findMany();

    console.log("📊 Statistiques:");
    console.log("- Total assurés:", allInsuredPersons.length);
    console.log("- Total entreprises:", allEnterprises.length);
    console.log(
      "- Total compagnies d'assurance:",
      allInsuranceCompanies.length
    );

    return NextResponse.json({
      user: {
        id: user?.id,
        insuranceCompanyId: user?.insuranceCompanyId,
        insuranceCompany: user?.insuranceCompany,
      },
      stats: {
        totalInsuredPersons: allInsuredPersons.length,
        totalEnterprises: allEnterprises.length,
        totalInsuranceCompanies: allInsuranceCompanies.length,
      },
      insuredPersons: allInsuredPersons.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        enterpriseId: p.enterpriseId,
        enterprise: p.enterprise
          ? {
              id: p.enterprise.id,
              name: p.enterprise.name,
              insuranceCompanyId: p.enterprise.insuranceCompanyId,
              insuranceCompany: p.enterprise.insuranceCompany?.name,
            }
          : null,
      })),
      enterprises: allEnterprises.map((e) => ({
        id: e.id,
        name: e.name,
        insuranceCompanyId: e.insuranceCompanyId,
        insuranceCompany: e.insuranceCompany?.name,
      })),
      insuranceCompanies: allInsuranceCompanies.map((c) => ({
        id: c.id,
        name: c.name,
      })),
    });
  } catch (error) {
    console.error("Erreur lors du debug:", error);
    return NextResponse.json(
      { error: "Erreur lors du debug" },
      { status: 500 }
    );
  }
}
