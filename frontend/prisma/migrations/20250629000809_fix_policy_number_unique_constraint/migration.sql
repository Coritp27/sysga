/*
  Warnings:

  - A unique constraint covering the columns `[policyNumber,insuranceCompanyId]` on the table `Policy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Policy_policyNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyNumber_insuranceCompanyId_key" ON "Policy"("policyNumber", "insuranceCompanyId");
