/*
  Warnings:

  - You are about to drop the column `planType` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `PlanFeatures` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `planId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "planType",
ADD COLUMN     "planId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PlanFeatures";

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "dailyFilesLimit" INTEGER NOT NULL,
    "categoryLimit" INTEGER NOT NULL,
    "hasTemplates" BOOLEAN NOT NULL,
    "autoEmailReports" BOOLEAN NOT NULL,
    "allowedFormats" "ExportFormat"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
