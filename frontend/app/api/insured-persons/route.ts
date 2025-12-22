import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// GET - Récupérer tous les assurés
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

    let whereClause: any = {};

    // Logique corrigée : récupérer uniquement les assurés de la compagnie d'assurance
    // Chaque compagnie ne doit voir que ses propres assurés

    // Filtrer par compagnie d'assurance via les entreprises
    whereClause.OR = [
      {
        enterprise: {
          insuranceCompanyId: user.insuranceCompanyId,
        },
      },
      // Inclure aussi les assurés sans entreprise (si nécessaire)
      // {
      //   enterpriseId: null,
      // },
    ];

    // Recherche par nom, email, CIN, NIF
    if (search) {
      const searchConditions = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { cin: { contains: search, mode: "insensitive" } },
        { nif: { contains: search, mode: "insensitive" } },
      ];

      // Combiner avec les conditions existantes
      whereClause.AND = [{ OR: whereClause.OR }, { OR: searchConditions }];
      delete whereClause.OR;
    }

    // Debug: afficher les conditions de recherche
    console.log(
      "Conditions de recherche:",
      JSON.stringify(whereClause, null, 2)
    );
    console.log(
      "Compagnie d'assurance ID:",
      user.insuranceCompanyId
    );

    const insuredPersons = await prisma.insuredPerson.findMany({
      where: whereClause,
      include: {
        enterprise: {
          select: {
            id: true,
            name: true,
            insuranceCompanyId: true,
          },
        },
        insuranceCards: {
          select: {
            id: true,
            status: true,
            insuranceCompany: {
              select: {
                id: true,
                name: true,
              },
            },
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
      orderBy: {
        id: "desc",
      },
    });

    console.log("Nombre d'assurés trouvés:", insuredPersons.length);
    console.log(
      "Assurés:",
      insuredPersons.map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        enterpriseId: p.enterpriseId,
      }))
    );

    return NextResponse.json(insuredPersons);
  } catch (error) {
    console.error("Erreur lors de la récupération des assurés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des assurés" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel assuré
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

    // Vérifier que l'entreprise appartient bien à la compagnie
    if (enterpriseId) {
      const enterprise = await prisma.enterprise.findUnique({
        where: { id: Number(enterpriseId) },
      });
      if (
        !enterprise ||
        enterprise.insuranceCompanyId !== user.insuranceCompanyId
      ) {
        return NextResponse.json(
          {
            error: "L'entreprise n'appartient pas à la compagnie d'assurance.",
          },
          { status: 400 }
        );
      }
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.insuredPerson.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Un assuré avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Vérifier si le CIN existe déjà
    const existingCin = await prisma.insuredPerson.findUnique({
      where: { cin },
    });

    if (existingCin) {
      return NextResponse.json(
        { error: "Un assuré avec ce CIN existe déjà" },
        { status: 400 }
      );
    }

    // Vérifier si le NIF existe déjà
    const existingNif = await prisma.insuredPerson.findUnique({
      where: { nif },
    });

    if (existingNif) {
      return NextResponse.json(
        { error: "Un assuré avec ce NIF existe déjà" },
        { status: 400 }
      );
    }

    const insuredPerson = await prisma.insuredPerson.create({
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
            insuranceCompany: {
              select: {
                id: true,
                name: true,
              },
            },
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

    return NextResponse.json(insuredPerson, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'assuré:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'assuré" },
      { status: 500 }
    );
  }
}
