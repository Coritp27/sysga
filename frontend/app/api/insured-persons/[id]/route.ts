import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - Mettre à jour un assuré
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      address,
      gender,
      cin,
      nif,
      hasDependent,
      numberOfDependent,
      policyEffectiveDate,
      enterpriseId,
    } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !cin || !nif) {
      return NextResponse.json(
        { error: "Les champs prénom, nom, email, CIN et NIF sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'assuré existe
    const existingPerson = await prisma.insuredPerson.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: "Assuré non trouvé" }, { status: 404 });
    }

    // Vérifier si l'email existe déjà (sauf pour cet assuré)
    const existingEmail = await prisma.insuredPerson.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Un assuré avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Vérifier si le CIN existe déjà (sauf pour cet assuré)
    const existingCin = await prisma.insuredPerson.findFirst({
      where: {
        cin,
        id: { not: id },
      },
    });

    if (existingCin) {
      return NextResponse.json(
        { error: "Un assuré avec ce CIN existe déjà" },
        { status: 400 }
      );
    }

    // Vérifier si le NIF existe déjà (sauf pour cet assuré)
    const existingNif = await prisma.insuredPerson.findFirst({
      where: {
        nif,
        id: { not: id },
      },
    });

    if (existingNif) {
      return NextResponse.json(
        { error: "Un assuré avec ce NIF existe déjà" },
        { status: 400 }
      );
    }

    const updatedPerson = await prisma.insuredPerson.update({
      where: { id },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        email,
        phone,
        address,
        gender,
        cin,
        nif,
        hasDependent: hasDependent || false,
        numberOfDependent: numberOfDependent || 0,
        policyEffectiveDate: new Date(policyEffectiveDate),
        enterpriseId: enterpriseId ? parseInt(enterpriseId) : null,
      },
      include: {
        enterprise: {
          select: {
            id: true,
            name: true,
          },
        },
        insuranceCards: {
          select: {
            id: true,
            status: true,
          },
        },
        dependents: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            relation: true,
            nationalId: true,
            isActive: true,
            insuredPersonId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'assuré:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'assuré" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un assuré
export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Vérifier si l'assuré existe
    const existingPerson = await prisma.insuredPerson.findUnique({
      where: { id },
      include: {
        insuranceCards: true,
      },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: "Assuré non trouvé" }, { status: 404 });
    }

    // Vérifier si l'assuré a des cartes d'assurance
    if (existingPerson.insuranceCards.length > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer cet assuré car il a des cartes d'assurance associées",
        },
        { status: 400 }
      );
    }

    // Supprimer l'assuré
    await prisma.insuredPerson.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Assuré supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'assuré:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'assuré" },
      { status: 500 }
    );
  }
}
