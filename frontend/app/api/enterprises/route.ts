import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// GET - Récupérer toutes les entreprises de la compagnie de l'utilisateur connecté
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }
    // Récupérer l'utilisateur et sa compagnie
    const user = await prisma.user.findFirst({
      where: { idClerk: userId, isDeleted: false },
    });
    if (!user?.insuranceCompanyId) {
      return NextResponse.json(
        { error: "Aucune compagnie associée" },
        { status: 403 }
      );
    }
    const enterprises = await prisma.enterprise.findMany({
      where: { insuranceCompanyId: user.insuranceCompanyId, isDeleted: false },
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
      orderBy: { name: "asc" },
    });
    return NextResponse.json(enterprises);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des entreprises:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entreprises" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle entreprise liée à la compagnie de l'utilisateur connecté
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }
    // Récupérer l'utilisateur et sa compagnie
    const user = await prisma.user.findFirst({
      where: { idClerk: userId, isDeleted: false },
    });
    if (!user?.insuranceCompanyId) {
      return NextResponse.json(
        { error: "Aucune compagnie associée" },
        { status: 403 }
      );
    }
    const body = await request.json();
    const {
      name,
      email,
      phone1,
      phone2,
      address,
      website,
      fiscalNumber,
      numberOfEmployees,
    } = body;
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
        insuranceCompanyId: user.insuranceCompanyId,
        createdBy: user.username || "system",
        lastModifiedBy: user.username || "system",
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
