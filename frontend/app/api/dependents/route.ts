import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer tous les dépendants d'un assuré
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const insuredPersonId = searchParams.get("insuredPersonId");

    if (!insuredPersonId) {
      return NextResponse.json(
        { error: "insuredPersonId est requis" },
        { status: 400 }
      );
    }

    const dependents = await prisma.dependent.findMany({
      where: {
        insuredPersonId: parseInt(insuredPersonId),
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(dependents);
  } catch (error) {
    console.error("Erreur lors de la récupération des dépendants:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau dépendant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      relation,
      nationalId,
      insuredPersonId,
    } = body;

    // Validation des champs requis
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !relation ||
      !insuredPersonId
    ) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être fournis" },
        { status: 400 }
      );
    }

    // Vérifier que l'assuré existe
    const insuredPerson = await prisma.insuredPerson.findUnique({
      where: { id: parseInt(insuredPersonId) },
    });

    if (!insuredPerson) {
      return NextResponse.json({ error: "Assuré non trouvé" }, { status: 404 });
    }

    // Vérifier si le nationalId est unique (si fourni)
    if (nationalId) {
      const existingDependent = await prisma.dependent.findUnique({
        where: { nationalId },
      });

      if (existingDependent) {
        return NextResponse.json(
          { error: "Ce numéro national est déjà utilisé" },
          { status: 409 }
        );
      }
    }

    const dependent = await prisma.dependent.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        relation,
        nationalId,
        insuredPersonId: parseInt(insuredPersonId),
        createdBy: "system", // À remplacer par l'utilisateur connecté
        lastModifiedBy: "system", // À remplacer par l'utilisateur connecté
      },
    });

    return NextResponse.json(dependent, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du dépendant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
