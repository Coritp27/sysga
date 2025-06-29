import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
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

    // Récupérer l'utilisateur avec sa compagnie
    const user = await prisma.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
      include: {
        insuranceCompany: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (!user.insuranceCompany) {
      return NextResponse.json(
        { error: "Aucune compagnie d'assurance associée" },
        { status: 400 }
      );
    }

    // Mettre à jour les informations de la compagnie
    const updatedCompany = await prisma.insuranceCompany.update({
      where: {
        id: user.insuranceCompany.id,
      },
      data: {
        name,
        email,
        phone1,
        phone2,
        address,
        website,
        fiscalNumber,
        numberOfEmployees,
      },
    });

    return NextResponse.json({
      message: "Compagnie mise à jour avec succès",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Erreur API mise à jour compagnie:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
