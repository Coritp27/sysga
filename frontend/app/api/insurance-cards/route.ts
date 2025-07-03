import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Récupérer toutes les cartes d'assurance de la compagnie
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let whereClause: any = {
      insuranceCompanyId: user.insuranceCompanyId,
    };

    // Recherche par numéro de carte, nom de l'assuré, numéro de police
    if (search) {
      whereClause.OR = [
        { cardNumber: { contains: search, mode: "insensitive" } },
        { insuredPersonName: { contains: search, mode: "insensitive" } },
        { policyNumber: { equals: BigInt(search) || BigInt(0) } },
      ];
    }

    const insuranceCards = await prisma.insuranceCard.findMany({
      where: whereClause,
      include: {
        insuredPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            cin: true,
            nif: true,
          },
        },
        insuranceCompany: {
          select: {
            id: true,
            name: true,
          },
        },
        blockchainReference: {
          select: {
            id: true,
            reference: true,
            blockchainTxHash: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // Convertir BigInt en Number pour la sérialisation JSON
    const serializedCards = insuranceCards.map((card) => ({
      ...card,
      policyNumber: Number(card.policyNumber),
      blockchainReference: card.blockchainReference
        ? {
            ...card.blockchainReference,
            reference: Number(card.blockchainReference.reference),
          }
        : null,
    }));

    return NextResponse.json(serializedCards);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des cartes d'assurance:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cartes d'assurance" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle carte d'assurance
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      insuredPersonId,
      cardNumber,
      policyNumber,
      dateOfBirth,
      policyEffectiveDate,
      hadDependent,
      status,
      validUntil,
      blockchainReference,
      blockchainTxHash,
    } = body;

    // Validation des champs requis
    if (
      !insuredPersonId ||
      !cardNumber ||
      !policyNumber ||
      !dateOfBirth ||
      !policyEffectiveDate ||
      !validUntil
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que la personne assurée existe et appartient à la compagnie
    const insuredPerson = await prisma.insuredPerson.findFirst({
      where: {
        id: Number(insuredPersonId),
        enterprise: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
      },
    });

    if (!insuredPerson) {
      return NextResponse.json(
        { error: "Personne assurée non trouvée ou non autorisée" },
        { status: 404 }
      );
    }

    // Vérifier si le numéro de carte existe déjà
    const existingCard = await prisma.insuranceCard.findUnique({
      where: { cardNumber },
    });

    if (existingCard) {
      return NextResponse.json(
        { error: "Une carte avec ce numéro existe déjà" },
        { status: 400 }
      );
    }

    // Créer la carte d'assurance
    const insuranceCard = await prisma.insuranceCard.create({
      data: {
        insuredPersonName: `${insuredPerson.firstName} ${insuredPerson.lastName}`,
        policyNumber: BigInt(policyNumber),
        cardNumber,
        dateOfBirth: new Date(dateOfBirth),
        policyEffectiveDate: new Date(policyEffectiveDate),
        hadDependent: hadDependent || false,
        status: status || "ACTIVE",
        validUntil: new Date(validUntil),
        insuranceCompanyId: user.insuranceCompanyId,
        insuredPersonId: Number(insuredPersonId),
      },
      include: {
        insuredPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            cin: true,
            nif: true,
          },
        },
        insuranceCompany: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Si une référence blockchain est fournie, la créer
    if (blockchainReference && blockchainTxHash) {
      await prisma.blockchainReference.create({
        data: {
          reference: BigInt(blockchainReference),
          cardNumber,
          blockchainTxHash,
        },
      });
    }

    // Récupérer la carte avec la référence blockchain
    const cardWithReference = await prisma.insuranceCard.findUnique({
      where: { id: insuranceCard.id },
      include: {
        insuredPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            cin: true,
            nif: true,
          },
        },
        insuranceCompany: {
          select: {
            id: true,
            name: true,
          },
        },
        blockchainReference: {
          select: {
            id: true,
            reference: true,
            blockchainTxHash: true,
            createdAt: true,
          },
        },
      },
    });

    // Convertir BigInt en Number pour la sérialisation JSON
    const serializedCard = {
      ...cardWithReference,
      policyNumber: Number(cardWithReference?.policyNumber),
      blockchainReference: cardWithReference?.blockchainReference
        ? {
            ...cardWithReference.blockchainReference,
            reference: Number(cardWithReference.blockchainReference.reference),
          }
        : null,
    };

    return NextResponse.json(serializedCard, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la carte d'assurance:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la carte d'assurance" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une carte d'assurance
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { id, ...updateData } = body;

    // Vérifier que la carte appartient à la compagnie
    const existingCard = await prisma.insuranceCard.findFirst({
      where: {
        id: Number(id),
        insuranceCompanyId: user.insuranceCompanyId,
      },
    });

    if (!existingCard) {
      return NextResponse.json(
        { error: "Carte d'assurance non trouvée ou non autorisée" },
        { status: 404 }
      );
    }

    // Mettre à jour la carte
    const updatedCard = await prisma.insuranceCard.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        insuredPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            cin: true,
            nif: true,
          },
        },
        insuranceCompany: {
          select: {
            id: true,
            name: true,
          },
        },
        blockchainReference: {
          select: {
            id: true,
            reference: true,
            blockchainTxHash: true,
            createdAt: true,
          },
        },
      },
    });

    // Convertir BigInt en Number pour la sérialisation JSON
    const serializedCard = {
      ...updatedCard,
      policyNumber: Number(updatedCard.policyNumber),
      blockchainReference: updatedCard.blockchainReference
        ? {
            ...updatedCard.blockchainReference,
            reference: Number(updatedCard.blockchainReference.reference),
          }
        : null,
    };

    return NextResponse.json(serializedCard);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la carte d'assurance:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la carte d'assurance" },
      { status: 500 }
    );
  }
}
