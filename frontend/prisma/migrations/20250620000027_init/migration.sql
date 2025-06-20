/*
  Warnings:

  - You are about to drop the column `issuedOn` on the `InsuranceCard` table. All the data in the column will be lost.
  - You are about to drop the column `blockchainTxHash` on the `InsuredPerson` table. All the data in the column will be lost.
  - You are about to drop the column `merkleGeneratedAt` on the `InsuredPerson` table. All the data in the column will be lost.
  - You are about to drop the column `merkleRoot` on the `InsuredPerson` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InsuredPerson` table. All the data in the column will be lost.
  - You are about to drop the column `premium` on the `Policy` table. All the data in the column will be lost.
  - You are about to alter the column `deductible` on the `Policy` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `Blockchain_reference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `InsuredPerson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cin]` on the table `InsuredPerson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nif]` on the table `InsuredPerson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[insuredPersonId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `InsuranceCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hadDependent` to the `InsuranceCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insuredPersonName` to the `InsuranceCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policyEffectiveDate` to the `InsuranceCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policyNumber` to the `InsuranceCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validUntil` to the `InsuranceCard` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `InsuranceCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `address` to the `InsuranceCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `InsuranceCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiscalNumber` to the `InsuranceCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfEmployees` to the `InsuranceCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone1` to the `InsuranceCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasDependent` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `InsuredPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `MedicalInstitution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `MedicalInstitution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiscalNumber` to the `MedicalInstitution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfEmployees` to the `MedicalInstitution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone1` to the `MedicalInstitution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premiumAmount` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validUntil` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Policy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `createdBy` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModifiedBy` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INSURER', 'MEDICAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "InsuranceCardStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('INDIVIDUAL', 'FAMILY');

-- DropForeignKey
ALTER TABLE "Blockchain_reference" DROP CONSTRAINT "Blockchain_reference_insuredPersonId_fkey";

-- AlterTable
ALTER TABLE "InsuranceCard" DROP COLUMN "issuedOn",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hadDependent" BOOLEAN NOT NULL,
ADD COLUMN     "insuredPersonName" TEXT NOT NULL,
ADD COLUMN     "policyEffectiveDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "policyNumber" BIGINT NOT NULL,
ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "InsuranceCardStatus" NOT NULL;

-- AlterTable
ALTER TABLE "InsuranceCompany" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fiscalNumber" TEXT NOT NULL,
ADD COLUMN     "numberOfEmployees" INTEGER NOT NULL,
ADD COLUMN     "phone1" TEXT NOT NULL,
ADD COLUMN     "phone2" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "InsuredPerson" DROP COLUMN "blockchainTxHash",
DROP COLUMN "merkleGeneratedAt",
DROP COLUMN "merkleRoot",
DROP COLUMN "userId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "enterpriseId" INTEGER,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "hasDependent" BOOLEAN NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalInstitution" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fiscalNumber" TEXT NOT NULL,
ADD COLUMN     "numberOfEmployees" INTEGER NOT NULL,
ADD COLUMN     "phone1" TEXT NOT NULL,
ADD COLUMN     "phone2" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "premium",
ADD COLUMN     "premiumAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "policyNumber" SET DATA TYPE BIGINT,
DROP COLUMN "type",
ADD COLUMN     "type" "PolicyType" NOT NULL,
ALTER COLUMN "deductible" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "insuredPersonId" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastModifiedBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userType" "UserType" NOT NULL,
ALTER COLUMN "institutionId" DROP NOT NULL;

-- DropTable
DROP TABLE "Blockchain_reference";

-- DropTable
DROP TABLE "Organization";

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "lastModifiedBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainReference_cardNumber_key" ON "BlockchainReference"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPerson_email_key" ON "InsuredPerson"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPerson_cin_key" ON "InsuredPerson"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPerson_nif_key" ON "InsuredPerson"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "User_insuredPersonId_key" ON "User"("insuredPersonId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPerson" ADD CONSTRAINT "InsuredPerson_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainReference" ADD CONSTRAINT "BlockchainReference_cardNumber_fkey" FOREIGN KEY ("cardNumber") REFERENCES "InsuranceCard"("cardNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
