/*
  Warnings:

  - You are about to drop the column `status` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Otps` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PaymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PlanFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Preferences` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Recovery` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - Added the required column `expiration` to the `Otps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiration` to the `Recovery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Otps" DROP COLUMN "status",
ADD COLUMN     "expiration" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "PlanFeatures" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Recovery" DROP COLUMN "status",
ADD COLUMN     "expiration" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status";

-- DropEnum
DROP TYPE "Status";
