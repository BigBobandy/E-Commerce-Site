-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShippingInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ShippingInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ShippingInfo" ("address", "city", "country", "id", "state", "userId", "zip") SELECT "address", "city", "country", "id", "state", "userId", "zip" FROM "ShippingInfo";
DROP TABLE "ShippingInfo";
ALTER TABLE "new_ShippingInfo" RENAME TO "ShippingInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
