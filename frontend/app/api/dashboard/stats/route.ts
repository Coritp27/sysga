import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        { error: "Aucune compagnie d'assurance associée" },
        { status: 403 }
      );
    }

    // Statistiques des cartes d'assurance
    const insuranceCardsCount = await prisma.insuranceCard.count({
      where: { insuranceCompanyId: user.insuranceCompanyId },
    });

    const activeCardsCount = await prisma.insuranceCard.count({
      where: {
        insuranceCompanyId: user.insuranceCompanyId,
        status: "ACTIVE",
      },
    });

    // Statistiques des personnes assurées
    const insuredPersonsCount = await prisma.insuredPerson.count({
      where: {
        enterprise: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
      },
    });

    // Statistiques des références blockchain
    const blockchainReferencesCount = await prisma.blockchainReference.count({
      where: {
        card: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
      },
    });

    // Statistiques des entreprises
    const enterprisesCount = await prisma.enterprise.count({
      where: { insuranceCompanyId: user.insuranceCompanyId },
    });

    const stats = {
      insuranceCards: {
        total: insuranceCardsCount,
        active: activeCardsCount,
        trend: 0, // Pas de tendance pour l'instant
      },
      insuredPersons: {
        total: insuredPersonsCount,
        trend: 0, // Pas de tendance pour l'instant
      },
      blockchainTransactions: {
        total: blockchainReferencesCount,
        trend: 0, // Pas de tendance pour l'instant
      },
      enterprises: {
        total: enterprisesCount,
        trend: 0, // Pas de tendance pour l'instant
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
