#!/usr/bin/env node

// Test SMS avec Twilio
import dotenv from "dotenv";
import twilio from "twilio";
import readline from "readline";

dotenv.config();

async function testSMS() {
  console.log("🧪 Test SMS avec Twilio\n");

  // Vérifier les credentials
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  console.log("🔧 Configuration:");
  console.log(
    `TWILIO_ACCOUNT_SID: ${accountSid ? "✅ Configuré" : "❌ Manquant"}`
  );
  console.log(
    `TWILIO_AUTH_TOKEN: ${authToken ? "✅ Configuré" : "❌ Manquant"}`
  );
  console.log(
    `TWILIO_PHONE_NUMBER: ${fromPhoneNumber ? "✅ Configuré" : "❌ Manquant"}\n`
  );

  if (!accountSid || !authToken || !fromPhoneNumber) {
    console.log("❌ Credentials Twilio manquants. Vérifiez votre fichier .env");
    return;
  }

  // Créer le client Twilio
  const client = twilio(accountSid, authToken);

  // Générer un code OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`📱 Code OTP généré: ${otpCode}`);

  // Demander le numéro de téléphone
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "📞 Entrez votre numéro de téléphone (format: +33123456789): ",
    async (phoneNumber) => {
      try {
        console.log(`\n📤 Envoi du SMS à ${phoneNumber}...`);

        const message = await client.messages.create({
          body: `Votre code de vérification SYSGA est: ${otpCode}. Ce code expire dans 5 minutes.`,
          from: fromPhoneNumber,
          to: phoneNumber,
        });

        console.log(`✅ SMS envoyé avec succès !`);
        console.log(`📱 Message SID: ${message.sid}`);
        console.log(`📱 Code OTP: ${otpCode}`);
      } catch (error) {
        console.error("❌ Erreur lors de l'envoi du SMS:", error.message);
      }

      rl.close();
    }
  );
}

testSMS().catch(console.error);
