-- CreateTable
CREATE TABLE "TestCase" (
    "id" SERIAL NOT NULL,
    "input" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
