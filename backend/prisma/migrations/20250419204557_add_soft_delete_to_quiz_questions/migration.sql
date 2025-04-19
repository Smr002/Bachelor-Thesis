/*
  Warnings:

  - You are about to drop the column `createdAt` on the `QuizQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "createdAt",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
