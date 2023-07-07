/*
  Warnings:

  - Added the required column `countryAbbrev` to the `ShippingInfo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShippingInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateAbbrev" TEXT,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryAbbrev" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ShippingInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ShippingInfo" ("address", "city", "country", "id", "isDefault", "state", "userId", "zip") SELECT "address", "city", "country", "id", "isDefault", "state", "userId", "zip" FROM "ShippingInfo";
DROP TABLE "ShippingInfo";
ALTER TABLE "new_ShippingInfo" RENAME TO "ShippingInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
