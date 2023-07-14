/*
  Warnings:

  - You are about to drop the `BillingInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cardHolder` to the `CardInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BillingInfo_cardInfoId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BillingInfo";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cardNumber" TEXT NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "cvv" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CardInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardInfo" ("cardNumber", "cardType", "cvv", "expiryDate", "id", "userId") SELECT "cardNumber", "cardType", "cvv", "expiryDate", "id", "userId" FROM "CardInfo";
DROP TABLE "CardInfo";
ALTER TABLE "new_CardInfo" RENAME TO "CardInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
