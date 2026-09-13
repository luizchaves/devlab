-- CreateTable
CREATE TABLE "Dividend" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "rate" DECIMAL(14,4) NOT NULL,
    "exDate" DATE NOT NULL,
    "paymentDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dividend_assetId_exDate_key" ON "Dividend"("assetId", "exDate");

-- AddForeignKey
ALTER TABLE "Dividend" ADD CONSTRAINT "Dividend_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
