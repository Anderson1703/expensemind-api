/*
  Warnings:

  - You are about to drop the column `urlFile` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "urlFile",
ADD COLUMN     "uploadedWithFile" BOOLEAN NOT NULL DEFAULT false;
