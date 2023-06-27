const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getUserByUrlString(req, res) {
  const { userUrlString } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userUrlString: userUrlString,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove sensitive user data
    delete user.password;

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getUserByUrlString };
