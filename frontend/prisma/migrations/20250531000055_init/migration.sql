-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "idKeycloak" TEXT NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

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
    "cin" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "numberOfDependent" INTEGER NOT NULL,
    "policyEffectiveDate" TIMESTAMP(3) NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "blockchainTxHash" TEXT NOT NULL,
    "merkleGeneratedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InsuredPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" SERIAL NOT NULL,
    "relation" TEXT NOT NULL,
    "insuredPersonId" INTEGER NOT NULL,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceCard" (
    "id" SERIAL NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "issuedOn" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "insuranceCompanyId" INTEGER NOT NULL,
    "insuredPersonId" INTEGER NOT NULL,

    CONSTRAINT "InsuranceCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" SERIAL NOT NULL,
    "policyNumber" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "coverage" TEXT NOT NULL,
    "deductible" DOUBLE PRECISION NOT NULL,
    "premium" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "insuranceCompanyId" INTEGER NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blockchain_reference" (
    "id" SERIAL NOT NULL,
    "insuredPersonId" INTEGER NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "blockchainTxHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blockchain_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "fiscalNumber" INTEGER NOT NULL,
    "numberOfEmployee" INTEGER NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InsuranceCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalInstitution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MedicalInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceCard_cardNumber_key" ON "InsuranceCard"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyNumber_key" ON "Policy"("policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_reference_insuredPersonId_key" ON "Blockchain_reference"("insuredPersonId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceCard" ADD CONSTRAINT "InsuranceCard_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "InsuranceCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceCard" ADD CONSTRAINT "InsuranceCard_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "InsuranceCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blockchain_reference" ADD CONSTRAINT "Blockchain_reference_insuredPersonId_fkey" FOREIGN KEY ("insuredPersonId") REFERENCES "InsuredPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
