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

// The function to find a user by their confirmation code.
// It uses Prisma's findFirst method to return the first user it finds
// with a matching email confirmation code.
async function findUserByCode(confirmationCode) {
  return await prisma.user.findFirst({
    where: { emailConfirmationCode: confirmationCode },
  });
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
    <h1>Thanks for signing up, ${user.name}!</h1> // name from user object
    <p>Please confirm your email address by entering the following code on the confirmation page:</p> 
    <h2><b>${emailConfirmationCode}</b></h2>
    <p>You can confirm your email by clicking the link below:</p>
    <h4><a href="http://localhost:5173/confirm/${emailConfirmationCode}">Click to confirm your email!</a></h4>
  `,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Handles POST requests to the /signup path
async function signup(req, res) {
  try {
    // Extract name, email, and password from request body
    const { name, email, password } = req.body;

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

// handling manual email confirmation using the confirmation modal
async function confirm(req, res) {
  try {
    const { confirmationCode } = req.body; // get the email confirmation code from the request body

    console.log("/confirm Req body", req.body);

    // Search the database for the user with the matching email confirmation code
    const user = await findUserByCode(confirmationCode);
    console.log("User search result:", user);

    // If user does not exist, or code does not match, send an error message
    if (!user) {
      return res.status(400).json({ error: "Invalid code." });
    }

    // If user exists and code matches, confirm the user
    await prisma.user.update({
      where: { id: user.id }, // update using the id
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
}

// The endpoint for confirming a user's email. It's a GET request to "/confirm/:codeParam",
// where ":codeParam" is a placeholder for the email confirmation code that will be supplied in the URL.
async function confirmCode(req, res) {
  // The confirmation code is extracted from the URL parameters.
  const confirmationCode = req.params.codeParam;

  try {
    // Search the database for the user with the matching email confirmation code
    const user = await findUserByCode(confirmationCode);

    // If the user is not found, send a 404 response.
    if (!user) {
      console.error("User not found, sending 404 response.");
      return res.status(404).send("User not found!");
    }

    // If the user's email has already been confirmed, respond with a message
    // indicating that the email has already been confirmed.
    if (user.isEmailConfirmed) {
      console.log("User's email is already confirmed, sending 200 response.");
      return res.status(200).send("This email has already been confirmed.");
    }

    // Update the user's email confirmation status in the database
    // Where the confirmation code from the parameters matches the user's code in the data base
    const updateUser = await prisma.user.update({
      where: { id: user.id }, // using the user's id here
      data: { emailConfirmationCode: null, isEmailConfirmed: true },
    });

    // If the user is updated successfully, send a 200 response.
    if (updateUser) {
      console.log("Update successful, sending 200 response.");
      return res.status(200).send("Email confirmed!");
    } else {
      console.error("Update failed, sending 500 response.");
      // If the user was not updated for some reason, send a 500 response.
      console.error(`Failed to update user: ${confirmationCode}`);
      return res.status(500).send("An error occurred.");
    }
  } catch (error) {
    console.error(`Failed to confirm user email: ${error}`);
    return res.status(500).send("An error occurred.");
  }
}

module.exports = { signup, confirm, confirmCode };
