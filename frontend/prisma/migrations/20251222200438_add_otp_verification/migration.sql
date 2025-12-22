-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INSURER', 'MEDICAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "InsuranceCardStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('INDIVIDUAL', 'FAMILY', 'GROUP', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "idClerk" TEXT NOT NULL,
    "walletAddress" TEXT,
    "institutionId" INTEGER,
    "insuranceCompanyId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roleId" INTEGER NOT NULL,
    "insuredPersonId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "lastModifiedBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "canRead" BOOLEAN NOT NULL,
    "canWrite" BOOLEAN NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuredPerson" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "hasDependent" BOOLEAN NOT NULL,
    "numberOfDependent" INTEGER NOT NULL,
    "policyEffectiveDate" TIMESTAMP(3) NOT NULL,
    "enterpriseId" INTEGER,

    CONSTRAINT "InsuredPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "nationalId" TEXT,
    "insuredPersonId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "lastModifiedBy" TEXT NOT NULL DEFAULT 'system',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enterprise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "fiscalNumber" TEXT NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL,
    "insuranceCompanyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "lastModifiedBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceCard" (
    "id" SERIAL NOT NULL,
    "insuredPersonName" TEXT NOT NULL,
    "policyNumber" BIGINT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "policyEffectiveDate" TIMESTAMP(3) NOT NULL,
    "hadDependent" BOOLEAN NOT NULL,
    "status" "InsuranceCardStatus" NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "insuranceCompanyId" INTEGER NOT NULL,
    "insuredPersonId" INTEGER NOT NULL,

    CONSTRAINT "InsuranceCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" SERIAL NOT NULL,
    "policyNumber" INTEGER NOT NULL,
    "type" "PolicyType" NOT NULL,
    "coverage" TEXT NOT NULL,
    "deductible" DECIMAL(65,30) NOT NULL,
    "premiumAmount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "insuranceCompanyId" INTEGER NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockchainReference" (
    "id" SERIAL NOT NULL,
    "reference" BIGINT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "blockchainTxHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockchainReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "fiscalNumber" TEXT NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL,
    "blockchainAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "lastModifiedBy" TEXT NOT NULL DEFAULT 'system',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InsuranceCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalInstitution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "fiscalNumber" TEXT NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL,

    CONSTRAINT "MedicalInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTPVerification" (
    "id" SERIAL NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "otpCode" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "OTPVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_insuredPersonId_key" ON "User"("insuredPersonId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPerson_email_key" ON "InsuredPerson"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPerson_cin_key" ON "InsuredPerson"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPerson_nif_key" ON "InsuredPerson"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "Dependent_nationalId_key" ON "Dependent"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceCard_cardNumber_key" ON "InsuranceCard"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyNumber_insuranceCompanyId_key" ON "Policy"("policyNumber", "insuranceCompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainReference_cardNumber_key" ON "BlockchainReference"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceCompany_blockchainAddress_key" ON "InsuranceCompany"("blockchainAddress");

-- CreateIndex
CREATE INDEX "OTPVerification_cardNumber_otpCode_idx" ON "OTPVerification"("cardNumber", "otpCode");

-- CreateIndex
CREATE INDEX "OTPVerification_expiresAt_idx" ON "OTPVerification"("expiresAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "InsuranceCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPerson" ADD CONSTRAINT "InsuredPerson_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enterprise" ADD CONSTRAINT "Enterprise_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "InsuranceCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceCard" ADD CONSTRAINT "InsuranceCard_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "InsuranceCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceCard" ADD CONSTRAINT "InsuranceCard_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "InsuranceCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainReference" ADD CONSTRAINT "BlockchainReference_cardNumber_fkey" FOREIGN KEY ("cardNumber") REFERENCES "InsuranceCard"("cardNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
