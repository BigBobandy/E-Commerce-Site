/*
  Warnings:

  - You are about to drop the column `emailConfrimationCodeCreatedAt` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailConfirmationCode" TEXT,
    "emailConfirmationCodeCreatedAt" DATETIME,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "userUrlString" TEXT NOT NULL,
    "resetPasswordCode" TEXT,
    "resetPasswordCodeCreatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailConfirmationCode", "firstName", "id", "isEmailConfirmed", "lastName", "password", "resetPasswordCode", "resetPasswordCodeCreatedAt", "updatedAt", "userUrlString") SELECT "createdAt", "email", "emailConfirmationCode", "firstName", "id", "isEmailConfirmed", "lastName", "password", "resetPasswordCode", "resetPasswordCodeCreatedAt", "updatedAt", "userUrlString" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_userUrlString_key" ON "User"("userUrlString");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
