import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Récupérer toutes les entreprises filtrées par compagnie si précisé
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API enterprises appelée");

    const { searchParams } = new URL(request.url);
    const insuranceCompanyId = searchParams.get("insuranceCompanyId");
    console.log("📊 insuranceCompanyId:", insuranceCompanyId);

    const where = insuranceCompanyId
      ? { insuranceCompanyId: Number(insuranceCompanyId) }
      : {};
    console.log("🔍 where clause:", where);

    console.log("📊 Exécution de la requête Prisma...");
    const enterprises = await prisma.enterprise.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone1: true,
        phone2: true,
        address: true,
        website: true,
        fiscalNumber: true,
        numberOfEmployees: true,
        insuranceCompanyId: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`✅ ${enterprises.length} entreprise(s) trouvée(s)`);
    return NextResponse.json(enterprises);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des entreprises:", error);
    console.error("Stack trace:", (error as Error).stack);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entreprises" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle entreprise liée à la compagnie d'assurance de l'utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Pour l'instant, on récupère l'ID de la compagnie depuis le body (à sécuriser avec l'auth plus tard)
    const {
      name,
      email,
      phone1,
      phone2,
      address,
      website,
      fiscalNumber,
      numberOfEmployees,
      insuranceCompanyId,
    } = body;

    if (!insuranceCompanyId) {
      return NextResponse.json(
        { error: "insuranceCompanyId requis" },
        { status: 400 }
      );
    }

    const newEnterprise = await prisma.enterprise.create({
      data: {
        name,
        email,
        phone1,
        phone2,
        address,
        website,
        fiscalNumber,
        numberOfEmployees,
        insuranceCompanyId,
        createdBy: "system",
        lastModifiedBy: "system",
      },
    });

    return NextResponse.json(newEnterprise, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'entreprise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500 }
    );
  }
}
