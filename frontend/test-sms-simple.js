#!/usr/bin/env node

// Test SMS avec Twilio - Version simple
import twilio from "twilio";
import readline from "readline";

async function testSMS() {
  console.log("Test SMS avec Twilio\n");

  // Credentials Twilio (remplacez par vos vraies valeurs)
  const accountSid = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Remplacez par votre Account SID
  const authToken = "votre_auth_token_ici"; // Remplacez par votre Auth Token
  const fromPhoneNumber = "+1234567890"; // Remplacez par votre numéro Twilio

  console.log("Configuration:");
  console.log(
    `TWILIO_ACCOUNT_SID: ${
      accountSid.includes("xxxx") ? "À configurer" : "OK (configuré)"
    }`
  );
  console.log(
    `TWILIO_AUTH_TOKEN: ${
      authToken.includes("votre_") ? "À configurer" : "OK (configuré)"
    }`
  );
  console.log(
    `TWILIO_PHONE_NUMBER: ${
      fromPhoneNumber.includes("1234") ? "À configurer" : "OK (configuré)"
    }\n`
  );

  if (
    accountSid.includes("xxxx") ||
    authToken.includes("votre_") ||
    fromPhoneNumber.includes("1234")
  ) {
    console.log(
      "Veuillez d'abord configurer vos credentials Twilio dans le script"
    );
    console.log(
      "Éditez le fichier test-sms-simple.js et remplacez les valeurs"
    );
    return;
  }

  // Créer le client Twilio
  const client = twilio(accountSid, authToken);

  // Générer un code OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Code OTP généré: ${otpCode}`);

  // Demander le numéro de téléphone
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Entrez votre numéro de téléphone (format: +33123456789): ",
    async (phoneNumber) => {
      try {
        console.log(`\nEnvoi du SMS à ${phoneNumber}...`);

        const message = await client.messages.create({
          body: `Votre code de vérification SYSGA est: ${otpCode}. Ce code expire dans 5 minutes.`,
          from: fromPhoneNumber,
          to: phoneNumber,
        });

        console.log(`SMS envoyé avec succès !`);
        console.log(`Message SID: ${message.sid}`);
        console.log(`Code OTP: ${otpCode}`);
      } catch (error) {
        console.error("Erreur lors de l'envoi du SMS:", error.message);
      }

      rl.close();
    }
  );
}

testSMS().catch(console.error);
