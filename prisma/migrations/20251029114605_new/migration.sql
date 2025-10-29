/*
  Warnings:

  - You are about to drop the column `amount` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `profit` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `currentAmount` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investedAmount` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "amount",
DROP COLUMN "plan",
DROP COLUMN "profit",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "currentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "investedAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastProfitDate" TIMESTAMP(3),
ADD COLUMN     "planId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "InvestmentPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dailyReturn" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "InvestmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
