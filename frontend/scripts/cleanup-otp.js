const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanupExpiredOTP() {
  try {
    const now = new Date();

    // Supprimer les codes OTP expirés
    const deleted = await prisma.oTPVerification.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: now } }, { isUsed: true }],
      },
    });

    console.log(`✅ Nettoyage terminé: ${deleted.count} codes OTP supprimés`);
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le nettoyage
cleanupExpiredOTP();
