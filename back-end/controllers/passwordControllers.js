const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Function to format the code into a more readable format
function formatCode(code) {
  // Ensure the code is a string
  if (typeof code !== "string") {
    code = code.toString();
  }

  let formattedCode = "";
  // Insert a hyphen after every third digit for readability
  for (let i = 0; i < code.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedCode += "-";
    }
    formattedCode += code[i];
  }

  return formattedCode;
}

// Function to send a reset password email to the user
async function sendResetPasswordEmail(user, resetPasswordCode) {
  // Create a test account using ethereal
  let testAccount = await nodemailer.createTestAccount();

  // Set up the email transport using the test account
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Construct the email and send it to the user
  const info = await transporter.sendMail({
    from: "no-reply@example.com",
    to: user.email,
    subject: "Reset your password",
    html: `
      <h1>Reset Password Request</h1>
      <p>You have requested to reset your password. Here is your reset code:</p>
      <h2><b>${resetPasswordCode}</b></h2>
      <p>If you did not request this password reset, please ignore this email.</p>
    `,
  });

  // Log the result of the email send
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Handles the password reset email functionality.
// This function is used by a route on the back-end when a user is trying to change their password.
// The user enters their email to confirm it, and then a password reset email is sent to the user
// with a reset code that the user must enter to change their password.
async function resetPasswordEmail(req, res) {
  try {
    const email = req.body.email;

    // Verify that an account with the email exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a password reset code
    let resetCode = crypto.randomBytes(5).toString("hex").substring(0, 9);

    // Format the reset code
    resetCode = formatCode(resetCode);

    // Store the reset code in the database for the user with the given email
    await prisma.user.update({
      where: { email: email },
      data: { resetPasswordCode: resetCode },
    });

    // Send the reset password email with the reset code
    await sendResetPasswordEmail(user, resetCode);

    // Return a success response
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error in resetPasswordEmail:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

// Expose the sendResetPasswordEmail function for use in other parts of the application
module.exports = { resetPasswordEmail };
