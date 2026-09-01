-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Host_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Host" ("id", "name", "address", "createdAt", "userId") SELECT "id", "name", "address", "createdAt", "userId" FROM "Host" WHERE "userId" IS NOT NULL;
DROP TABLE "Host";
ALTER TABLE "new_Host" RENAME TO "Host";
CREATE INDEX "Host_userId_idx" ON "Host"("userId");
PRAGMA foreign_keys=ON;
