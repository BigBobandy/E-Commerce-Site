const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { client: mailgunClient } = require("../utils/mailgunConfig");
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
  // HTML content for the confirmation email
  const emailContent = `
  <h1>Thanks for signing up, ${user.firstName}!</h1>
  <p>Please confirm your email address by entering the following code on the confirmation page:</p>
  <h2><b>${emailConfirmationCode}</b></h2>
  <p>You can confirm your email by clicking the link below:</p>
`;
  const messageData = {
    from: "Dirty Burger <dirtyburgerdev@gmail.com>",
    to: user.email,
    subject: "Confirm your email",
    text: "Please confirm your email",
    html: emailContent,
  };

  try {
    const result = await mailgunClient.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
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
      return res.status(400).json({ error: "Email already in use." });
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
        isGuest: false,
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

// Handles POST requests to the /createGuest path
async function createGuest(req, res) {
  try {
    // Extract name and email from request body
    const { firstName, lastName, email } = req.body;

    console.log("/createGuest Req body: ", req.body);

    // Check if email exists and is a string
    if (typeof email !== "string" || email.length === 0) {
      return res.status(400).json({ error: "Invalid email." });
    }

    // Check if email is already in use
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Generate a random 9-digit code for the user's profile url
    let userUrlString = crypto.randomBytes(5).toString("hex").substring(0, 9);

    // Use prisma to store new guest's information
    const newGuest = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        isGuest: true,
        userUrlString,
      },
    });

    // send the new user, which is a gues, back in the response
    res.status(201).json({ user: newGuest });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
}
// Function to re-send the email confirmation code if the user didn't receive the first one or if it's expired
async function resendConfirmationEmail(req, res) {
  try {
    const { email } = req.body; // Get email from request body

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
    const codeAge = Math.floor(
      (new Date() - new Date(user.emailConfirmationCodeCreatedAt)) / (1000 * 60)
    );

    // If either condition is true, generate a new code for the user and store it
    if (!user.emailConfirmationCode || codeAge > 10) {
      console.log(
        "Old confirmation code found: Generating a new one for the user"
      );

      // Generate a new email confirmation code
      let emailConfirmationCode = crypto
        .randomBytes(5)
        .toString("hex")
        .substring(0, 9);

      // Format the code
      emailConfirmationCode = formatCode(emailConfirmationCode);

      // Update user in the database with the new confirmation code and the current time
      await prisma.user.update({
        where: { email },
        data: {
          emailConfirmationCode,
          emailConfirmationCodeCreatedAt: new Date(),
        },
      });
    }

    // Use the existing sendConfirmationEmail function to send the new confirmation email
    await sendConfirmationEmail(user, user.emailConfirmationCode);

    // Return success response
    res.status(200).json({ message: "Email confirmation code resent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while resending the confirmation code.",
    });
  }
}
module.exports = { signup, resendConfirmationEmail, createGuest };
