/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Preferences_userId_key" ON "Preferences"("userId");
