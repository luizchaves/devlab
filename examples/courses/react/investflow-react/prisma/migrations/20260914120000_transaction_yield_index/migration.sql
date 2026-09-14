-- CreateEnum
CREATE TYPE "YieldIndex" AS ENUM ('fixed', 'cdi', 'selic', 'ipca');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "yieldIndex" "YieldIndex" NOT NULL DEFAULT 'fixed';
