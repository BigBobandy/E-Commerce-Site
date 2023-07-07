/*
  Warnings:

  - You are about to drop the column `quantity` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `stock` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MenuItem" ("category", "createdAt", "description", "id", "imageUrl", "name", "price", "updatedAt") SELECT "category", "createdAt", "description", "id", "imageUrl", "name", "price", "updatedAt" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
