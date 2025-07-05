import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    // Récupérer les 5 cartes les plus récentes
    const recentCards = await prisma.insuranceCard.findMany({
      where: { insuranceCompanyId: user.insuranceCompanyId },
      include: {
        insuredPerson: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        blockchainReference: {
          select: {
            blockchainTxHash: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 5,
    });

    // Formater les données pour l'affichage
    const formattedCards = recentCards.map((card) => ({
      id: card.id.toString(),
      cardNumber: card.cardNumber,
      insuredPerson: `${card.insuredPerson.firstName} ${card.insuredPerson.lastName}`,
      status: card.status.toLowerCase(),
      blockchainStatus: card.blockchainReference ? "confirmed" : "pending",
      createdAt: card.blockchainReference?.createdAt || new Date(),
      transactionHash: card.blockchainReference?.blockchainTxHash,
    }));

    return NextResponse.json(formattedCards);
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes récentes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cartes récentes" },
      { status: 500 }
    );
  }
}
