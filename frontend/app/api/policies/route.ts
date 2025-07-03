import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Récupérer toutes les polices
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur et sa compagnie d'assurance
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

    // Recherche par numéro de police ou description
    if (search) {
      whereClause.OR = [
        { policyNumber: { equals: parseInt(search) || 0 } },
        { description: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ];
    }

    const policies = await prisma.policy.findMany({
      where: whereClause,
      include: {
        insuranceCompany: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        policyNumber: "desc",
      },
    });

    return NextResponse.json(policies);
  } catch (error) {
    console.error("Erreur lors de la récupération des polices:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des polices" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle police
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur et sa compagnie d'assurance
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
      policyNumber,
      type,
      coverage,
      deductible,
      premiumAmount,
      description,
      validUntil,
    } = body;

    // Validation des champs requis
    if (!policyNumber || !type || !coverage || !description || !validUntil) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le numéro de police existe déjà pour cette compagnie
    const existingPolicy = await prisma.policy.findFirst({
      where: {
        policyNumber: parseInt(policyNumber),
        insuranceCompanyId: user.insuranceCompanyId,
      },
    });

    if (existingPolicy) {
      return NextResponse.json(
        { error: "Un numéro de police existe déjà pour cette compagnie" },
        { status: 400 }
      );
    }

    const policy = await prisma.policy.create({
      data: {
        policyNumber: parseInt(policyNumber),
        type,
        coverage,
        deductible: parseFloat(deductible),
        premiumAmount: parseFloat(premiumAmount),
        description,
        validUntil: new Date(validUntil),
        insuranceCompanyId: user.insuranceCompanyId,
      },
      include: {
        insuranceCompany: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la police:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la police" },
      { status: 500 }
    );
  }
}

// PUT - Update a policy (only if it belongs to the user's company)
export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findFirst({
    where: { idClerk: userId, isDeleted: false },
  });
  if (!user?.insuranceCompanyId)
    return NextResponse.json({ error: "No company" }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  const policy = await prisma.policy.findUnique({ where: { id } });
  if (!policy || policy.insuranceCompanyId !== user.insuranceCompanyId) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  try {
    const updated = await prisma.policy.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Error updating policy" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a policy (only if it belongs to the user's company)
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findFirst({
    where: { idClerk: userId, isDeleted: false },
  });
  if (!user?.insuranceCompanyId)
    return NextResponse.json({ error: "No company" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const policy = await prisma.policy.findUnique({ where: { id } });
  if (!policy || policy.insuranceCompanyId !== user.insuranceCompanyId) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  try {
    await prisma.policy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Error deleting policy" },
      { status: 500 }
    );
  }
}
