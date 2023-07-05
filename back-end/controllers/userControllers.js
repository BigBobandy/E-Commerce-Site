const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function getUserByUrlString(req, res) {
  const { userUrlString } = req.params; // Destructure req.params to get the userUrlString

  try {
    // Find the user in the database with this userUrlString
    const user = await prisma.user.findUnique({
      where: {
        userUrlString: userUrlString,
      },
    });

    // If that user isn't found throw an error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove sensitive user data
    delete user.password;

    // Send the user's information back as the response
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// Handles making changes to the user's first and last name
async function updateUser(req, res) {
  // Extract 'firstName' and 'lastName' from the request body
  const { firstName, lastName } = req.body;

  try {
    // Get the JWT from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Declare a variable to hold the decoded token
    let decoded;

    try {
      // Try to verify and decode the JWT using the secret
      // jwt.verify() will throw an error if the verification fails
      // This could happen if the token is not valid, or if it has expired
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If jwt.verify() throws an error, catch it and log the error
      console.log(err);

      // Return a 401 status code (Unauthorized) and a relevant error message
      // This provides a clear indication to the user (and to the developer) that
      // the JWT verification failed, rather than just returning a generic 500 error.
      // It's also important for security to stop the execution here if the user isn't properly authenticated
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    // Get the user ID from the decoded token
    const userId = decoded.id;

    // Update the user with the userId with the new firstName and lastName
    const user = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
    });

    // If no user was found with the userId, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete the 'password' field from the user object before sending it as a response.
    // It's considered a good practice not to send sensitive information like passwords over the network
    // even if they are hashed or encrypted.
    delete user.password;

    // Send the updated user object as a response
    res.json(user);
  } catch (err) {
    console.log(err);
    // If something went wrong during the operation (like a database issue), return a server error
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getUserByUrlString, updateUser };
