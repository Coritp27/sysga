#!/usr/bin/env node

// Test SMS avec Twilio - Version avec variables d'environnement
import twilio from "twilio";
import readline from "readline";
import { readFileSync } from "fs";

// Charger les variables d'environnement depuis le fichier .env
function loadEnvFile() {
  try {
    const envContent = readFileSync(".env", "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join("=").trim();
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error(
      "Erreur lors de la lecture du fichier .env:",
      error.message
    );
    return {};
  }
}

async function testSMS() {
  console.log("Test SMS avec Twilio (fichier .env)\n");

  // Charger les variables d'environnement
  const envVars = loadEnvFile();

  // Récupérer les credentials
  const accountSid = envVars.TWILIO_ACCOUNT_SID;
  const authToken = envVars.TWILIO_AUTH_TOKEN;
  const fromPhoneNumber = envVars.TWILIO_PHONE_NUMBER;

  console.log("Configuration:");
  console.log(
    `TWILIO_ACCOUNT_SID: ${accountSid ? "OK (configuré)" : "Manquant"}`
  );
  console.log(
    `TWILIO_AUTH_TOKEN: ${authToken ? "OK (configuré)" : "Manquant"}`
  );
  console.log(
    `TWILIO_PHONE_NUMBER: ${fromPhoneNumber ? "OK (configuré)" : "Manquant"}\n`
  );

  if (!accountSid || !authToken || !fromPhoneNumber) {
    console.log("Credentials Twilio manquants dans le fichier .env");
    console.log("📝 Vérifiez que votre fichier .env contient :");
    console.log("   TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID");
    console.log("   TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN");
    console.log("   TWILIO_PHONE_NUMBER=+1234567890");
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
