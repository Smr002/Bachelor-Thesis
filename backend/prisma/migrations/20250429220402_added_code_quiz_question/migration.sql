/*
  Warnings:

  - You are about to drop the column `code` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "code" TEXT;
