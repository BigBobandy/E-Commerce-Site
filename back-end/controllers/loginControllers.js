const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function login(req, res) {
  try {
    // Deconstruct request body to get the email and password the user submitted when attempting to login
    const { email, password } = req.body;

    // Check if the user exists using the email from the request
    const user = await prisma.user.findUnique({ where: { email } });

    // If the user isn't found send an error back
    if (!user) {
      return res
        .status(400)
        .json({ error: "User not found: Invalid email address." });
    }

    // The user is found so now compare the password the user entered with the password stored
    // for that user in the database
    const passwordValid = await bcrypt.compare(password, user.password);
    // If the passwords don't match send an error back
    if (!passwordValid) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    // Check if the user's email is confirmed yet or not
    // If it isn't throw an error and force the user to confirm their email before they can log in
    if (!user.isEmailConfirmed) {
      return (
        res
          // Sending back a specific error code that when received
          // by the client will cause the re-send confirmation email link to appear
          .status(403)
          .json({ error: "Please confirm your email before logging in." })
      );
    }

    // Now the user has been found, the password is correct, and their email is confirmed
    // Create JWT (JSON Web Token)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    // Send token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
}

async function validateToken(req, res) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token using the same secret that was used to sign it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the id from the decoded token
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    // If the user is not found, return an error
    if (!user) {
      return res.status(400).json({ error: "Invalid token: user not found." });
    }

    // If the user is found, return the user's data
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
}

module.exports = { login, validateToken };
