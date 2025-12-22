// Configuration Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Configuration Email
const emailService = process.env.EMAIL_SERVICE || "gmail";
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;

// Import conditionnel de Twilio
let twilio: any = null;
let client: any = null;

// Import conditionnel de Nodemailer
let nodemailer: any = null;
let sgMail: any = null;

try {
  twilio = require("twilio");
  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
  }
} catch (error) {
  console.warn("Twilio not installed. Using development mode for SMS.");
}

try {
  nodemailer = require("nodemailer");
} catch (error) {
  console.warn("Nodemailer not installed. Using development mode for email.");
}

try {
  sgMail = require("@sendgrid/mail");
  if (sendGridApiKey) {
    sgMail.setApiKey(sendGridApiKey);
  }
} catch (error) {
  console.warn("SendGrid not installed. Using development mode for email.");
}

if (!accountSid || !authToken || !fromPhoneNumber) {
  console.warn(
    "Twilio credentials not configured. SMS will work in development mode only."
  );
}

if (!emailUser || !emailPass) {
  console.warn(
    "Email credentials not configured. Email will work in development mode only."
  );
}

export interface OTPService {
  sendSMS(phoneNumber: string, otpCode: string): Promise<boolean>;
  sendEmail(email: string, otpCode: string): Promise<boolean>;
}

class TwilioOTPService implements OTPService {
  async sendSMS(phoneNumber: string, otpCode: string): Promise<boolean> {
    if (!client || !fromPhoneNumber) {
      console.log(
        `[DEV] SMS OTP would be sent to ${phoneNumber}: ${otpCode}`
      );
      return true; // En développement, on simule l'envoi
    }

    try {
      const message = await client.messages.create({
        body: `Votre code de vérification VeriCarte est: ${otpCode}. Ce code expire dans 5 minutes.`,
        from: fromPhoneNumber,
        to: phoneNumber,
      });

      console.log(`SMS OTP sent successfully: ${message.sid}`);
      return true;
    } catch (error) {
      console.error("Error sending SMS OTP:", error);
      return false;
    }
  }

  async sendEmail(email: string, otpCode: string): Promise<boolean> {
    // Essayer SendGrid d'abord
    if (sgMail && sendGridApiKey && sendGridFromEmail) {
      try {
        const msg = {
          to: email,
          from: sendGridFromEmail,
          subject: "Code de vérification VeriCarte",
          text: `Votre code de vérification VeriCarte est: ${otpCode}. Ce code expire dans 5 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Code de vérification VeriCarte</h2>
              <p>Votre code de vérification est :</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">${otpCode}</span>
              </div>
              <p>Ce code expire dans 5 minutes.</p>
              <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
            </div>
          `,
        };

        await sgMail.send(msg);
        console.log(`Email OTP sent successfully via SendGrid to ${email}`);
        return true;
      } catch (error) {
        console.error("Error sending email via SendGrid:", error);
      }
    }

    // Essayer Nodemailer avec Gmail
    if (nodemailer && emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: emailService,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const mailOptions = {
          from: emailUser,
          to: email,
          subject: "Code de vérification VeriCarte",
          text: `Votre code de vérification VeriCarte est: ${otpCode}. Ce code expire dans 5 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Code de vérification VeriCarte</h2>
              <p>Votre code de vérification est :</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">${otpCode}</span>
              </div>
              <p>Ce code expire dans 5 minutes.</p>
              <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(
          `Email OTP sent successfully via Nodemailer to ${email}`
        );
        return true;
      } catch (error) {
        console.error("Error sending email via Nodemailer:", error);
      }
    }

    // Mode développement
    console.log(`[DEV] Email OTP would be sent to ${email}: ${otpCode}`);
    return true;
  }
}

export const otpService = new TwilioOTPService();

// Fonction utilitaire pour générer un code OTP
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fonction pour valider le format du numéro de téléphone
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Format international simple: +33123456789
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

// Fonction pour valider le format de l'email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
