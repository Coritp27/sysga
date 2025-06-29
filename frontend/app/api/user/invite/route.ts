import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, roleId = 2 } = body; // roleId 2 par défaut (utilisateur standard)

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    // Récupérer l'utilisateur qui invite
    const invitingUser = await prisma.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
      include: {
        insuranceCompany: true,
      },
    });

    if (!invitingUser) {
      return NextResponse.json(
        { error: "Utilisateur invitant non trouvé" },
        { status: 404 }
      );
    }

    if (!invitingUser.insuranceCompanyId) {
      return NextResponse.json(
        {
          error:
            "Vous devez être associé à une compagnie d'assurance pour inviter des utilisateurs",
        },
        { status: 403 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        username: email, // Utiliser l'email comme username
        isDeleted: false,
      },
    });

    if (existingUser) {
      // Si l'utilisateur existe déjà, le mettre à jour pour l'associer à la compagnie
      if (existingUser.insuranceCompanyId !== invitingUser.insuranceCompanyId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            insuranceCompanyId: invitingUser.insuranceCompanyId,
            roleId,
            lastModifiedBy: invitingUser.username,
          },
        });
      }
    } else {
      // Créer un nouvel utilisateur
      await prisma.user.create({
        data: {
          username: email,
          userType: "INSURER",
          idClerk: `temp_${Date.now()}`, // ID temporaire, sera mis à jour lors de la première connexion
          insuranceCompanyId: invitingUser.insuranceCompanyId,
          roleId,
          createdBy: invitingUser.username,
          lastModifiedBy: invitingUser.username,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Utilisateur ${email} invité avec succès dans le workspace`,
    });
  } catch (error) {
    console.error("Erreur API invite:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Route pour récupérer les membres du workspace
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur qui demande
    const requestingUser = await prisma.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
      include: {
        insuranceCompany: true,
      },
    });

    if (!requestingUser?.insuranceCompanyId) {
      return NextResponse.json(
        { error: "Vous devez être associé à une compagnie d'assurance" },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs de la même compagnie
    const workspaceMembers = await prisma.user.findMany({
      where: {
        insuranceCompanyId: requestingUser.insuranceCompanyId,
        isDeleted: false,
      },
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Mapper les données pour inclure l'email (username) et isActive
    const mappedMembers = workspaceMembers.map((member) => ({
      ...member,
      email: member.username, // Le username contient l'email
      isActive: !member.isDeleted, // Calculer le statut actif
    }));

    return NextResponse.json(mappedMembers);
  } catch (error) {
    console.error("Erreur API workspace members:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Route pour retirer un utilisateur du workspace
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { error: "ID du membre requis" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur qui fait la demande
    const requestingUser = await prisma.user.findFirst({
      where: {
        idClerk: userId,
        isDeleted: false,
      },
    });

    if (!requestingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur à supprimer appartient à la même compagnie
    const memberToRemove = await prisma.user.findFirst({
      where: {
        id: parseInt(memberId),
        insuranceCompanyId: requestingUser.insuranceCompanyId,
        isDeleted: false,
      },
    });

    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Membre non trouvé ou non autorisé" },
        { status: 404 }
      );
    }

    // Ne pas permettre de se supprimer soi-même
    if (memberToRemove.id === requestingUser.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous retirer vous-même du workspace" },
        { status: 400 }
      );
    }

    // Supprimer logiquement l'utilisateur
    await prisma.user.update({
      where: { id: parseInt(memberId) },
      data: {
        isDeleted: true,
        lastModifiedBy: requestingUser.username,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Membre retiré du workspace avec succès",
    });
  } catch (error) {
    console.error("Erreur API remove member:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
