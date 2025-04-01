-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "constraints" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "starterCode" TEXT NOT NULL DEFAULT '// Write your code here';
