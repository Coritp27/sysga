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

    // Récupérer les statistiques blockchain de la compagnie
    const blockchainStats = await prisma.blockchainReference.count({
      where: {
        card: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
      },
    });

    // Récupérer les transactions récentes (dernières 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTransactions = await prisma.blockchainReference.count({
      where: {
        card: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    // Récupérer les transactions en attente (pas encore confirmées)
    // Pour l'instant, on considère qu'une transaction est en attente si elle a moins de 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const pendingTransactions = await prisma.blockchainReference.count({
      where: {
        card: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Informations réseau (pour l'instant statiques, mais on pourrait les récupérer via un provider)
    const networkInfo = {
      network: "Ethereum Sepolia",
      status: "Connected",
      lastBlock: "4,567,890", // Ceci devrait être récupéré via un provider
      gasPrice: "15 Gwei", // Ceci devrait être récupéré via un provider
    };

    const blockchainStatus = {
      ...networkInfo,
      totalTransactions: blockchainStats,
      recentTransactions,
      pendingTransactions,
      // Calculer le pourcentage de transactions confirmées
      confirmationRate:
        blockchainStats > 0
          ? Math.round(
              ((blockchainStats - pendingTransactions) / blockchainStats) * 100
            )
          : 100,
    };

    return NextResponse.json(blockchainStatus);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du statut blockchain:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération du statut blockchain" },
      { status: 500 }
    );
  }
}
