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

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    // Récupérer l'utilisateur avec sa compagnie d'assurance
    const user = await prisma.user.findFirst({
      where: {
        idKeycloak: userId,
        isDeleted: false,
      },
      include: {
        insuranceCompany: true,
        role: true,
      },
    });

    if (!user) {
      // Si l'utilisateur n'existe pas encore, le créer
      const newUser = await prisma.user.create({
        data: {
          username: `user_${userId}`,
          userType: "INSURER",
          idKeycloak: userId,
          walletAddress: walletAddress || null,
          roleId: 1, // Rôle par défaut
          createdBy: "system",
          lastModifiedBy: "system",
        },
        include: {
          insuranceCompany: true,
          role: true,
        },
      });

      return NextResponse.json({
        id: newUser.idKeycloak,
        walletAddress: newUser.walletAddress,
        insuranceCompany: newUser.insuranceCompany,
        role: newUser.role,
      });
    }

    // Mettre à jour l'adresse du wallet si elle a changé
    if (walletAddress && user.walletAddress !== walletAddress) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          walletAddress,
          lastModifiedBy: "system",
        },
      });
      user.walletAddress = walletAddress;
    }

    return NextResponse.json({
      id: user.idKeycloak,
      walletAddress: user.walletAddress,
      insuranceCompany: user.insuranceCompany,
      role: user.role,
    });
  } catch (error) {
    console.error("Erreur API workspace:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
