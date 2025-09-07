import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testOTPFlow() {
  try {
    console.log("🧪 Test du flow OTP...");

    // 1. Créer un code OTP de test
    const testCardNumber = "TEST123456";
    const testPhoneNumber = "+33123456789";
    const testOTPCode = "123456";
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log("📝 Création d'un code OTP de test...");
    const otpVerification = await prisma.oTPVerification.create({
      data: {
        cardNumber: testCardNumber,
        phoneNumber: testPhoneNumber,
        otpCode: testOTPCode,
        expiresAt: expiresAt,
        attempts: 0,
        maxAttempts: 3,
      },
    });

    console.log("✅ Code OTP créé:", {
      id: otpVerification.id,
      cardNumber: otpVerification.cardNumber,
      otpCode: otpVerification.otpCode,
      expiresAt: otpVerification.expiresAt,
    });

    // 2. Vérifier le code OTP
    console.log("🔍 Vérification du code OTP...");
    const foundOTP = await prisma.oTPVerification.findFirst({
      where: {
        cardNumber: testCardNumber,
        otpCode: testOTPCode,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (foundOTP) {
      console.log("✅ Code OTP trouvé et valide");

      // Marquer comme utilisé
      await prisma.oTPVerification.update({
        where: { id: foundOTP.id },
        data: { isUsed: true },
      });

      console.log("✅ Code OTP marqué comme utilisé");
    } else {
      console.log("❌ Code OTP non trouvé ou expiré");
    }

    // 3. Nettoyage
    console.log("🧹 Nettoyage des données de test...");
    await prisma.oTPVerification.deleteMany({
      where: { cardNumber: testCardNumber },
    });

    console.log("✅ Test terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testOTPFlow();
