-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cardNumber" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CardInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardInfo" ("cardHolder", "cardNumber", "cardType", "cvv", "expiryDate", "id", "isDefault", "userId") SELECT "cardHolder", "cardNumber", "cardType", "cvv", "expiryDate", "id", "isDefault", "userId" FROM "CardInfo";
DROP TABLE "CardInfo";
ALTER TABLE "new_CardInfo" RENAME TO "CardInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
