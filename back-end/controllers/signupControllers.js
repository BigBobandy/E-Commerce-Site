const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Function for formatting the email confirmation code that is called after the code is generated
function formatCode(code) {
  // Convert the code to a string if it's not already
  if (typeof code !== "string") {
    code = code.toString();
  }

  // Insert a hyphen after every third digit
  let formattedCode = "";
  for (let i = 0; i < code.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedCode += "-";
    }
    formattedCode += code[i];
  }

  return formattedCode;
}

// Function containing confirmation email sending logic
async function sendConfirmationEmail(user, emailConfirmationCode) {
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

  // Send the confirmation email
  const info = await transporter.sendMail({
    from: "no-reply@example.com",
    to: user.email, // email from user object
    subject: "Confirm your email",
    html: `
      <h1>Thanks for signing up, ${user.firstName}!</h1>
      <p>Please confirm your email address by entering the following code on the confirmation page:</p> 
      <h2><b>${emailConfirmationCode}</b></h2>
      <p>You can confirm your email by clicking the link below:</p>
      
    `,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Handles POST requests to the /signup path
async function signup(req, res) {
  try {
    // Extract name, email, and password from request body
    const { firstName, lastName, email, password } = req.body;

    console.log("/signup Req body: ", req.body);

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

    // Generate a random 9-digit confirmation code
    let emailConfirmationCode = crypto
      .randomBytes(5)
      .toString("hex")
      .substring(0, 9);

    // Format the code
    emailConfirmationCode = formatCode(emailConfirmationCode);

    // Generate a random 9-digit code for the user's profile url
    let userUrlString = crypto.randomBytes(5).toString("hex").substring(0, 9);

    // Use prisma to store new user's information
    // Saving the user's name, email, and password
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailConfirmationCode, // Save code in the database (will be only temporary)
        emailConfirmationCodeCreatedAt: new Date(),
        userUrlString,
      },
    });

    // Send confirmation email
    await sendConfirmationEmail(newUser, emailConfirmationCode);

    // Send a response back to the client with a status code of 201
    // (which means a new resource was successfully created)
    // and we include the new user's information in the response body.
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
}

// Function to re-send the email confirmation code email if the user didn't receive the first one for some reason
// Or if their email confirmation code is expired
async function resendConfirmationEmail(req, res) {
  try {
    const { email } = req.body; // get email from request body
    let emailConfirmationCode;

    // Verify that an account with the email exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // If user does not exist, return error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if an email confirmation code already exists for the user or if it's older than 10 minutes
    // If either of these are true then generate a new code for the user and store it
    const codeAge = Math.floor(
      (new Date() - new Date(user.emailConfirmationCodeCreatedAt)) / (1000 * 60)
    );
    if (!user.emailConfirmationCode || codeAge > 10) {
      // Generate a new email confirmation code
      let emailConfirmationCode = crypto
        .randomBytes(5)
        .toString("hex")
        .substring(0, 9);

      // Format the code
      emailConfirmationCode = formatCode(emailConfirmationCode);

      // Update user in the database with new confirmation code and the current time
      await prisma.user.update({
        where: { email },
        data: {
          emailConfirmationCode,
          emailConfirmationCodeCreatedAt: new Date(),
        },
      });
    }

    // Send new confirmation email
    await sendConfirmationEmail(user, emailConfirmationCode);

    // Return success response
    res.status(200).json({ message: "Email confirmation code resent." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while resending confirmation code." });
  }
}

module.exports = { signup, resendConfirmationEmail };
