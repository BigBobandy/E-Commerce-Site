-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailConfirmationCode" TEXT,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "urlNumber" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailConfirmationCode", "firstName", "id", "isEmailConfirmed", "lastName", "password", "updatedAt", "urlNumber") SELECT "createdAt", "email", "emailConfirmationCode", "firstName", "id", "isEmailConfirmed", "lastName", "password", "updatedAt", "urlNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
