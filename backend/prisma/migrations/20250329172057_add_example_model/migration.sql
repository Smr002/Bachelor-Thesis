/*
  Warnings:

  - You are about to drop the column `exampleInput` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `exampleOutput` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "exampleInput",
DROP COLUMN "exampleOutput",
ALTER COLUMN "constraints" DROP DEFAULT,
ALTER COLUMN "starterCode" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Example" (
    "id" SERIAL NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "explanation" TEXT,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
