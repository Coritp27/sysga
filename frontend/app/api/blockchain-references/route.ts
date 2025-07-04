import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur connecté et sa compagnie d'assurance
    const currentUser = await prismadb.user.findFirst({
      where: { idClerk: userId },
      include: { insuranceCompany: true },
    });

    if (!currentUser || !currentUser.insuranceCompanyId) {
      return NextResponse.json(
        { error: "Utilisateur ou compagnie d'assurance non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer les références blockchain liées à la compagnie d'assurance
    const references = await prismadb.blockchainReference.findMany({
      where: {
        card: {
          insuranceCompanyId: currentUser.insuranceCompanyId,
        },
      },
      include: {
        card: {
          include: {
            insuredPerson: {
              include: {
                user: true,
              },
            },
            insuranceCompany: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convertir les BigInt en string pour la sérialisation JSON
    const serializedReferences = references.map((ref) => ({
      ...ref,
      reference: ref.reference.toString(),
      card: ref.card
        ? {
            ...ref.card,
            policyNumber: ref.card.policyNumber.toString(),
            insuredPerson: ref.card.insuredPerson
              ? {
                  ...ref.card.insuredPerson,
                  user: ref.card.insuredPerson.user || null,
                }
              : null,
          }
        : null,
    }));

    return NextResponse.json(serializedReferences);
  } catch (error) {
    console.error(
      "Erreur détaillée lors de la récupération des références blockchain:",
      error
    );

    // Log plus détaillé de l'erreur
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des références blockchain",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
