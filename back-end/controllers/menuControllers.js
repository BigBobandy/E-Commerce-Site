const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Function to handle fetching all menu items
async function getAll(req, res) {
  try {
    const menuItems = await prisma.menuItem.findMany();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching menu items.");
  }
}

async function addMenuItem(req, res) {
  const { name, description, price, stock, category, imageUrl } = req.body;

  try {
    const newItem = await prisma.menuItem.create({
      data: { name, description, price, stock, category, imageUrl },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the new menu item.");
  }
}

module.exports = { getAll, addMenuItem };
