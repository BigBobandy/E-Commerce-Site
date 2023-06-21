const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // These are objects which contain all the properties needed for each menu item
  // I will later pass these to prisma.menuItem.create() to create the records in my database
  const mainItems = [
    {
      name: "Dirty Burger",
      description:
        "Our dirtiest and greasiest burger that will make you say BAAAAAM!",
      price: 8.99,
      quantity: 50,
      category: "Main",
      imageUrl: "./front-end/src/assets/food-images/DirtyBurger.jpg",
    },
    {
      name: "Double Dirty Deluxe",
      description:
        "Our dirtiest and greasiest burger this time with double the meat and grease.",
      price: 12.99,
      quantity: 75,
      category: "Main",
      imageUrl: "./front-end/src/assets/food-images/DirtyDouble.jpg",
    },
    {
      name: "The Mustard Tiger",
      description:
        "Extra long glizzy loaded up with mustard. For all you glizzy goblins out there.",
      price: 6.99,
      quantity: 125,
      category: "Main",
      imageUrl: "./front-end/src/assets/food-images/MustardTiger.jpg",
    },
  ];

  // do the same for side items, drink items, and dessert items
  const sideItems = [
    {
      name: "Filthy Fries",
      description: "Our signature fries served with extra filth.",
      price: 3.99,
      quantity: 100,
      category: "Sides",
      imageUrl: "./front-end/src/assets/food-images/FilthyFries.jpg",
    },
    {
      name: "Onion Rings",
      description: "I mean they're onion rings.",
      price: 5.99,
      quantity: 80,
      category: "Sides",
      imageUrl: "./front-end/src/assets/food-images/OnionRings.jpg",
    },
  ];

  const drinkItems = [
    {
      name: "Soft Drink",
      description: "Your choice of soft drink. Pepsi Products only.",
      price: 4.99,
      quantity: 80,
      category: "Drinks",
      imageUrl: "./front-end/src/assets/food-images/SodaMachine.jpg",
    },
    {
      name: "Slushy",
      description: "We got slushies all diferent flavors.",
      price: 6.49,
      quantity: 499,
      category: "Drinks",
      imageUrl: "./front-end/src/assets/food-images/Slushies.jpg",
    },
  ];

  const dessertItems = [
    {
      name: "Milk Shake",
      description:
        "Delicious milk shake. Get in vanilla, chocolate or strawberry. The choice is yours.",
      price: 5.99,
      quantity: 70,
      category: "Desserts",
      imageUrl: "./front-end/src/assets/food-images/milkshake.jpg",
    },
    {
      name: "Ice Cream Sundae",
      description:
        "We love sundaes don't we folks. Your choice of peach, strawberry or classic chocolate sundae.",
      price: 8.99,
      quantity: 75,
      category: "Desserts",
      imageUrl: "./front-end/src/assets/food-images/sundae.jpg",
    },
  ];

  // combine all my item arrays into one single array
  // This is for convenience, so I can create all items in the database in one go
  const allItems = [...mainItems, ...sideItems, ...drinkItems, ...dessertItems];

  // map over my combined array and create a new array where each element is a Promise that will resolve to a new record in the database
  // This is done using prisma.menuItem.create(), which creates a new record in the database
  // pass each item object from my combined array as the data argument
  const createdItems = allItems.map((item) =>
    prisma.menuItem.create({ data: item })
  );

  // Promise.all() is used to wait for all promises in an array to resolve before moving on
  // So this line will wait until all my menu items have been created in the database before continuing
  await Promise.all(createdItems);

  // Finally, I log to the console to let myself know that the seeding has completed successfully
  console.log("Seeded successfully");
}

// I call my main function
// This is what actually starts the script
// I have a .catch() to log any errors that might occur, and a .finally() to make sure
// I disconnect from the Prisma client when I'm done
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
