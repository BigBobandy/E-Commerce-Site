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

async function updateUser(req, res) {
  // Extract the 'userUrlString' from the route parameters
  const { userUrlString } = req.params;

  // Extract 'firstName' and 'lastName' from the request body
  const { firstName, lastName } = req.body;

  console.log(`userUrlString: ${userUrlString}`); // Check if userUrlString is being passed correctly
  console.log(`firstName: ${firstName}, lastName: ${lastName}`); // Check if firstName and lastName are being passed correctly

  try {
    // Update the user with the 'userUrlString' with the new firstName and lastName
    const user = await prisma.user.update({
      where: { userUrlString: userUrlString },
      data: { firstName, lastName },
    });

    // If no user was found with the 'userUrlString', return an error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete the 'password' and 'id' field from the user object before sending it as a response.
    // It's considered a good practice not to send sensitive information like passwords over the network
    // even if they are hashed or encrypted.
    delete user.password;
    delete user.id;

    // Send the updated user object as a response
    res.json(user);
  } catch (err) {
    console.log(err);
    // If something went wrong during the operation (like a database issue), return a server error
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getUserByUrlString, updateUser };
