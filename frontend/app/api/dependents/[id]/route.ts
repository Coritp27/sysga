import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer un dépendant spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dependent = await prisma.dependent.findUnique({
      where: {
        id: parseInt(params.id),
        isDeleted: false,
      },
    });

    if (!dependent) {
      return NextResponse.json(
        { error: "Dépendant non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(dependent);
  } catch (error) {
    console.error("Erreur lors de la récupération du dépendant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un dépendant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      relation,
      nationalId,
      isActive,
    } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !dateOfBirth || !gender || !relation) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être fournis" },
        { status: 400 }
      );
    }

    // Vérifier si le dépendant existe
    const existingDependent = await prisma.dependent.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingDependent) {
      return NextResponse.json(
        { error: "Dépendant non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si le nationalId est unique (si fourni et différent de l'actuel)
    if (nationalId && nationalId !== existingDependent.nationalId) {
      const duplicateDependent = await prisma.dependent.findUnique({
        where: { nationalId },
      });

      if (duplicateDependent) {
        return NextResponse.json(
          { error: "Ce numéro national est déjà utilisé" },
          { status: 409 }
        );
      }
    }

    const updatedDependent = await prisma.dependent.update({
      where: { id: parseInt(params.id) },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        relation,
        nationalId,
        isActive:
          isActive !== undefined ? isActive : existingDependent.isActive,
        lastModifiedBy: "system", // À remplacer par l'utilisateur connecté
      },
    });

    return NextResponse.json(updatedDependent);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du dépendant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un dépendant (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si le dépendant existe
    const existingDependent = await prisma.dependent.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingDependent) {
      return NextResponse.json(
        { error: "Dépendant non trouvé" },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.dependent.update({
      where: { id: parseInt(params.id) },
      data: {
        isDeleted: true,
        lastModifiedBy: "system", // À remplacer par l'utilisateur connecté
      },
    });

    return NextResponse.json({ message: "Dépendant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du dépendant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
