import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log("[API workspace] userId Clerk:", userId);

    if (!userId) {
      console.log("[API workspace] Utilisateur non authentifié");
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'email Clerk
    let email = "";
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
    } catch (e) {
      console.warn("[API workspace] Impossible de récupérer l'email Clerk", e);
    }

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    // S'assurer que le rôle Administrateur existe
    let adminRole = await prisma.role.findFirst({
      where: { name: "Administrateur" },
    });
    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: "Administrateur",
          canRead: true,
          canWrite: true,
          permission: "FULL_ACCESS",
        },
      });
      console.log("[API workspace] Rôle Administrateur créé");
    } else {
      console.log("[API workspace] Rôle Administrateur déjà existant");
    }

    // Récupérer l'utilisateur avec sa compagnie d'assurance
    let user = await prisma.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
      include: {
        insuranceCompany: true,
        role: true,
      },
    });
    console.log("[API workspace] Utilisateur trouvé:", user);

    if (!user) {
      // Créer une nouvelle compagnie pour chaque nouvel utilisateur
      const insuranceCompany = await prisma.insuranceCompany.create({
        data: {
          name: `Compagnie de ${userId}`,
          email: `contact+${userId}@assurance.com`,
          phone1: "+33 1 23 45 67 89",
          phone2: "",
          address: "1 rue du nouvel utilisateur, 75000 Paris, France",
          website: "",
          fiscalNumber: `FR${Math.floor(Math.random() * 1e10)}`,
          numberOfEmployees: 1,
          blockchainAddress: null,
          createdBy: "system",
          lastModifiedBy: "system",
        },
      });
      console.log("[API workspace] Compagnie créée:", insuranceCompany);

      user = await prisma.user.create({
        data: {
          username: email || `user_${userId}`,
          userType: "INSURER",
          idClerk: userId,
          walletAddress: walletAddress || null,
          insuranceCompanyId: insuranceCompany.id,
          roleId: adminRole.id, // Toujours administrateur à la création
          createdBy: "system",
          lastModifiedBy: "system",
        },
        include: {
          insuranceCompany: true,
          role: true,
        },
      });
      console.log("[API workspace] Utilisateur créé:", user);
    }

    // Mettre à jour l'adresse du wallet si elle a changé
    if (walletAddress && user.walletAddress !== walletAddress) {
      // Vérifier unicité
      const existingUser = await prisma.user.findFirst({
        where: {
          walletAddress: walletAddress,
          id: { not: user.id },
        },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Ce wallet est déjà associé à un autre utilisateur." },
          { status: 400 }
        );
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          walletAddress,
          lastModifiedBy: "system",
        },
      });
      user.walletAddress = walletAddress;
      console.log("[API workspace] Wallet mis à jour:", walletAddress);
    }

    console.log("[API workspace] Retour API:", {
      id: user.idClerk,
      walletAddress: user.walletAddress,
      insuranceCompany: user.insuranceCompany,
      role: user.role,
      isFirstUser: true,
    });

    return NextResponse.json({
      id: user.idClerk,
      walletAddress: user.walletAddress,
      insuranceCompany: user.insuranceCompany,
      role: user.role,
      isFirstUser: true,
    });
  } catch (error) {
    console.error("Erreur API workspace:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
