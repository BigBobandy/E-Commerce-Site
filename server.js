const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
var cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// Use body-parser middleware to parse incoming JSON
app.use(bodyParser.json());

app.use(cors());

// Set the port that the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Define route for user signup. Handles POST requests to the /signup path
app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    // Generating an account with ethereal (mock mail server)
    let testAccount = await nodemailer.createTestAccount();

    // setup object that will actually send the emails
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // this is true for port 465, and false for others
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Extract name, email, and password from request body
    const { name, email, password } = req.body;

    // Check if email exists and is a string
    if (typeof email !== "string" || email.length === 0) {
      return res.status(400).json({ error: "Invalid email." });
    }

    // Check if email is taken
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use bud." });
    }

    // If the email is not taken, hash the password the user gave
    // 'bcrypt.hash' is a function that takes a plain text password and a "salt round" (which is a measure of how complex the hashing is)
    // and returns a promise that resolves to the hashed password.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random confirmation code
    const emailConfirmationCode = crypto.randomBytes(8).toString("hex");

    // Use prisma to store new user's information
    // Saving the user's name, email, and password
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailConfirmationCode, // Save code in the database (will be only temporary)
      },
    });

    // Send the confirmation email
    const info = await transporter.sendMail({
      from: "no-reply@example.com",
      to: email,
      subject: "Confirm your email",
      text: `Thanks for signing up, ${name}! 
      Please confirm your email address by entering the following code on the confirmation page: 
     ${emailConfirmationCode}
      You can confirm your email by following this link: http://localhost:3000/confirm?email=${encodeURIComponent(
        email
      )}
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Send a response back to the client with a status code of 201
    // (which means a new resource was successfully created)
    // and we include the new user's information in the response body.
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

// Route for handling email confirmation on the /confirm path
app.post("/confirm", async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find the user with the provided email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user does not exist, or code does not match, send an error message
    if (!user || user.emailConfirmationCode !== code) {
      return res.status(400).json({ error: "Invalid code or email." });
    }

    // If user exists and code matches, confirm the user
    await prisma.user.update({
      where: { email },
      data: {
        emailConfirmationCode: null, // Clear the confirmation code since it's not needed anymore
        isEmailConfirmed: true,
      },
    });

    res.json({ message: "User email confirmed!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while confirming email." });
  }
});

app.get("/confirm", async (req, res) => {
  const { email } = req.query; // get the email from the query string

  // Search the database for the user with the matching email
  const user = await findUserByEmail(email);
  if (user) {
    user.status = "confirmed";
    // save changes to database
    await user.save();
    res.status(200).send("Email confirmed!");
  } else {
    res.status(404).send("User not found!");
  }
});
