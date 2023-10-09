-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER,
    "status" TEXT NOT NULL,
    "shippingInfoId" INTEGER,
    "cardInfoId" INTEGER,
    "totalPrice" REAL,
    "shippingMethod" TEXT,
    "shippingCost" REAL,
    "orderNumber" TEXT NOT NULL,
    "estDeliveryDate" TEXT,
    "deliveryDate" TEXT,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_shippingInfoId_fkey" FOREIGN KEY ("shippingInfoId") REFERENCES "ShippingInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_cardInfoId_fkey" FOREIGN KEY ("cardInfoId") REFERENCES "CardInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("cardInfoId", "createdAt", "deliveryDate", "estDeliveryDate", "id", "orderNumber", "shippingCost", "shippingInfoId", "shippingMethod", "status", "totalPrice", "updatedAt", "userId") SELECT "cardInfoId", "createdAt", "deliveryDate", "estDeliveryDate", "id", "orderNumber", "shippingCost", "shippingInfoId", "shippingMethod", "status", "totalPrice", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
