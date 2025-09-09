import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  otpService,
  generateOTPCode,
  validatePhoneNumber,
  validateEmail,
} from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardNumber, phoneNumber, email } = body;

    // Validation des paramètres
    if (!cardNumber) {
      return NextResponse.json(
        { error: "Numéro de carte requis" },
        { status: 400 }
      );
    }

    if (!phoneNumber && !email) {
      return NextResponse.json(
        { error: "Numéro de téléphone ou email requis" },
        { status: 400 }
      );
    }

    // Validation des formats
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: "Format de numéro de téléphone invalide" },
        { status: 400 }
      );
    }

    if (email && !validateEmail(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Vérifier que la carte existe
    const existingCard = await prisma.insuranceCard.findFirst({
      where: { cardNumber },
      include: { insuredPerson: true },
    });

    if (!existingCard) {
      return NextResponse.json(
        { error: "Carte d'assurance non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier le rate limiting (max 3 tentatives par heure)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentAttempts = await prisma.oTPVerification.count({
      where: {
        cardNumber,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentAttempts >= 3) {
      return NextResponse.json(
        { error: "Trop de tentatives. Veuillez réessayer dans 1 heure." },
        { status: 429 }
      );
    }

    // Générer le code OTP
    const otpCode = generateOTPCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Supprimer les anciens codes OTP pour cette carte
    await prisma.oTPVerification.deleteMany({
      where: { cardNumber },
    });

    // Créer le nouveau code OTP
    const otpVerification = await prisma.oTPVerification.create({
      data: {
        cardNumber,
        phoneNumber: phoneNumber || null,
        email: email || null,
        otpCode,
        expiresAt,
        attempts: 0,
        maxAttempts: 3,
      },
    });

    // Envoyer le code OTP
    let sent = false;
    if (phoneNumber) {
      sent = await otpService.sendSMS(phoneNumber, otpCode);
    } else if (email) {
      sent = await otpService.sendEmail(email, otpCode);
    }

    if (!sent) {
      // Supprimer le code OTP si l'envoi a échoué
      await prisma.oTPVerification.delete({
        where: { id: otpVerification.id },
      });

      return NextResponse.json(
        { error: "Erreur lors de l'envoi du code OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code OTP envoyé avec succès",
      expiresIn: 5 * 60, // 5 minutes en secondes
      method: phoneNumber ? "SMS" : "Email",
    });
  } catch (error) {
    console.error("❌ Error generating OTP:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
