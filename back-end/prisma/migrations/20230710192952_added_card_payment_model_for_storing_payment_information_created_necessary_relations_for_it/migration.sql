-- CreateTable
CREATE TABLE "CardInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cardNumber" TEXT NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "cvv" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CardInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BillingInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cardInfoId" INTEGER,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "BillingInfo_cardInfoId_fkey" FOREIGN KEY ("cardInfoId") REFERENCES "CardInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BillingInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BillingInfo" ("address", "city", "country", "id", "state", "userId", "zip") SELECT "address", "city", "country", "id", "state", "userId", "zip" FROM "BillingInfo";
DROP TABLE "BillingInfo";
ALTER TABLE "new_BillingInfo" RENAME TO "BillingInfo";
CREATE UNIQUE INDEX "BillingInfo_cardInfoId_key" ON "BillingInfo"("cardInfoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
