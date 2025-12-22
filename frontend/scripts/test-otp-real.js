#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { otpService, generateOTPCode } from "../lib/twilio.js";

const prisma = new PrismaClient();

async function testRealOTP() {
  console.log("Test d'envoi OTP réel\n");

  // Test 1: SMS
  console.log("Test SMS:");
  const phoneNumber = "+33123456789"; // Remplacez par votre numéro
  const smsOTP = generateOTPCode();
  console.log(`Code OTP généré: ${smsOTP}`);

  try {
    const smsResult = await otpService.sendSMS(phoneNumber, smsOTP);
    console.log(`Résultat SMS: ${smsResult ? "Succès" : "Échec"}\n`);
  } catch (error) {
    console.error("Erreur SMS:", error.message);
  }

  // Test 2: Email
  console.log("Test Email:");
  const email = "desiliasdimitry100@gmail.com"; // Remplacez par votre email
  const emailOTP = generateOTPCode();
  console.log(`Code OTP généré: ${emailOTP}`);

  try {
    const emailResult = await otpService.sendEmail(email, emailOTP);
    console.log(`Résultat Email: ${emailResult ? "Succès" : "Échec"}\n`);
  } catch (error) {
    console.error("Erreur Email:", error.message);
  }

  // Test 3: Vérification des variables d'environnement
  console.log("Configuration:");
  console.log(
    `TWILIO_ACCOUNT_SID: ${
      process.env.TWILIO_ACCOUNT_SID ? "OK (configuré)" : "Manquant"
    }`
  );
  console.log(
    `TWILIO_AUTH_TOKEN: ${
      process.env.TWILIO_AUTH_TOKEN ? "OK (configuré)" : "Manquant"
    }`
  );
  console.log(
    `TWILIO_PHONE_NUMBER: ${
      process.env.TWILIO_PHONE_NUMBER ? "OK (configuré)" : "Manquant"
    }`
  );
  console.log(
    `EMAIL_USER: ${
      process.env.EMAIL_USER ? "OK (configuré)" : "Manquant"
    }`
  );
  console.log(
    `EMAIL_PASS: ${
      process.env.EMAIL_PASS ? "OK (configuré)" : "Manquant"
    }`
  );
  console.log(
    `SENDGRID_API_KEY: ${
      process.env.SENDGRID_API_KEY ? "OK (configuré)" : "Manquant"
    }`
  );
  console.log(
    `SENDGRID_FROM_EMAIL: ${
      process.env.SENDGRID_FROM_EMAIL ? "OK (configuré)" : "Manquant"
    }`
  );

  await prisma.$disconnect();
}

testRealOTP().catch(console.error);
