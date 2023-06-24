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

    // Now the user has been found and the password they entered matches the password in the database
    // Check if the user email is confirmed before letting them login
    // If the email hasn't been confirmed yet send an error back informing the user they need to confirm their email
    if (!user.isEmailConfirmed) {
      return res
        .status(400)
        .json({ error: "Please confirm your email before logging in." });
    }

    // Now the user has been found, the password is correct, and their email is confirmed
    // Create JWT (JSON Web Token)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
}

module.exports = { login };
