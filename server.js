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
    const emailConfirmationCode = crypto.randomBytes(20).toString("hex");

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
      from: '"E-Commerce Site 👻" <no-reply@your-ecommerce-site.com>', // sender address
      to: email, // list of receivers
      subject: "Please confirm your email ✔", // Subject line
      text: `Here's your confirmation code: ${emailConfirmationCode}`, // plain text body
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
