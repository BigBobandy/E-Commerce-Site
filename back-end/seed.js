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
      price: 18.99,
      stock: 500,
      category: "Main",
      imageUrl: "/DirtyBurger.jpg",
    },
    {
      name: "Double Dirty Deluxe",
      description:
        "Our dirtiest and greasiest burger this time with double the meat and grease.",
      price: 21.99,
      stock: 750,
      category: "Main",
      imageUrl: "/DirtyDouble.jpg",
    },
    {
      name: "The Mustard Tiger",
      description:
        "Extra long glizzy loaded up with mustard. For all you glizzy goblins out there.",
      price: 16.99,
      stock: 1250,
      category: "Main",
      imageUrl: "/MustardTiger.jpg",
    },
  ];

  // do the same for side items, drink items, and dessert items
  const sideItems = [
    {
      name: "Filthy Fries",
      description: "Our signature fries served with extra filth.",
      price: 13.99,
      stock: 1000,
      category: "Sides",
      imageUrl: "/FilthyFries.jpg",
    },
    {
      name: "Onion Rings",
      description:
        "Greasy rings of deep fried onions. Fried in our oldest and dirtiest fryers for that extra level of filth.",
      price: 15.99,
      stock: 800,
      category: "Sides",
      imageUrl: "/OnionRings.jpg",
    },
  ];

  const drinkItems = [
    {
      name: "Soft Drink",
      description: "Your choice of soft drink. Pepsi Products only.",
      price: 14.99,
      stock: 800,
      category: "Drinks",
      imageUrl: "/SodaMachine.jpg",
    },
    {
      name: "Slushy",
      description: "We got slushies all diferent flavors.",
      price: 16.49,
      stock: 4990,
      category: "Drinks",
      imageUrl: "/Slushies.jpg",
    },
  ];

  const dessertItems = [
    {
      name: "Milk Shake",
      description:
        "Delicious milk shake. Get in vanilla, chocolate or strawberry. The choice is yours.",
      price: 15.99,
      stock: 700,
      category: "Desserts",
      imageUrl: "/milkshake.jpg",
    },
    {
      name: "Ice Cream Sundae",
      description:
        "We love sundaes don't we folks. Your choice of peach, strawberry or classic chocolate sundae.",
      price: 18.99,
      stock: 750,
      category: "Desserts",
      imageUrl: "/sundae.jpg",
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
