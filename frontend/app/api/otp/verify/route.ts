import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fonction utilitaire pour convertir les BigInt en string
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === "object") {
    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized;
  }

  return obj;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardNumber, otpCode } = body;

    // Validation des paramètres
    if (!cardNumber || !otpCode) {
      return NextResponse.json(
        { error: "Numéro de carte et code OTP requis" },
        { status: 400 }
      );
    }

    // Rechercher le code OTP
    const otpVerification = await prisma.oTPVerification.findFirst({
      where: {
        cardNumber,
        otpCode,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpVerification) {
      // Incrémenter les tentatives échouées
      await prisma.oTPVerification.updateMany({
        where: { cardNumber },
        data: { attempts: { increment: 1 } },
      });

      return NextResponse.json(
        { error: "Code OTP invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier le nombre de tentatives
    if (otpVerification.attempts >= otpVerification.maxAttempts) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives échouées. Veuillez demander un nouveau code.",
        },
        { status: 429 }
      );
    }

    // Marquer le code comme utilisé
    await prisma.oTPVerification.update({
      where: { id: otpVerification.id },
      data: { isUsed: true },
    });

    // Récupérer les données de la carte d'assurance
    const insuranceCard = await prisma.insuranceCard.findFirst({
      where: { cardNumber },
      include: {
        insuredPerson: true,
        insuranceCompany: true,
        blockchainReference: true,
      },
    });

    if (!insuranceCard) {
      return NextResponse.json(
        { error: "Carte d'assurance non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer tous les codes OTP pour cette carte (nettoyage)
    await prisma.oTPVerification.deleteMany({
      where: { cardNumber },
    });

    // Sérialiser les données pour éviter les erreurs BigInt
    const serializedData = serializeBigInt({
      id: insuranceCard.id,
      cardNumber: insuranceCard.cardNumber,
      insuredPersonName: insuranceCard.insuredPersonName,
      policyNumber: insuranceCard.policyNumber,
      dateOfBirth: insuranceCard.dateOfBirth,
      policyEffectiveDate: insuranceCard.policyEffectiveDate,
      validUntil: insuranceCard.validUntil,
      status: insuranceCard.status,
      hadDependent: insuranceCard.hadDependent,
      insuredPerson: insuranceCard.insuredPerson,
      insuranceCompany: insuranceCard.insuranceCompany,
      blockchainReference: insuranceCard.blockchainReference,
    });

    return NextResponse.json({
      success: true,
      message: "Code OTP vérifié avec succès",
      data: serializedData,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
