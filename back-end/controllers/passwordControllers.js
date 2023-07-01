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
      data: {
        resetPasswordCode: resetCode,
        resetPasswordCodeCreatedAt: new Date(),
      },
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

// Function to verify the reset password code
// This function is called when the user enters the code they received in their password reset email
// It will find the user based on the email and compare the code they entered with the code stored in the database
async function verifyResetPasswordCode(req, res) {
  try {
    const { email, code } = req.body;

    // Find the user in the database by email
    const user = await prisma.user.findUnique({ where: { email } });

    // If the user doesn't exist, or the code they entered doesn't match the one in the database,
    // return a 400 error and message
    if (!user || user.resetPasswordCode !== code) {
      return res.status(400).json({ error: "Invalid reset password code." });
    }

    // If the code is more than 10 minutes old, reject it
    const codeAge = Math.floor(
      (new Date() - new Date(user.resetPasswordCodeCreatedAt)) / (1000 * 60)
    );
    if (new Date(user.resetPasswordCodeCreatedAt) < codeAge) {
      return res.status(400).json({ error: "Reset password code expired." });
    }

    // If the code matches, return a 200 status and a success message
    res.status(200).json({ message: "Reset password code verified." });
  } catch (error) {
    console.error("Error in verifyResetPasswordCode:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

// Function to update the user's password
// This function is called after the user's reset password code has been verified
// It will hash the new password, then update the user's record in the database with the hashed password
// It will also set the resetPasswordCode to null as it is no longer needed
async function updatePassword(req, res) {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and reset the resetPasswordCode in the database
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetPasswordCode: null },
    });

    // Return a 200 status and a success message
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

// Function to re-send the reset password email if the user didn't receive the first one for some reason
// Or if their reset code is expired
async function resendResetPasswordEmail(req, res) {
  try {
    const { email } = req.body; // get email from request body

    // Verify that an account with the email exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if a password reset code already exists for the user or if it's older than 10 minutes
    // If either of these are true then generate a new code for the user and store it
    const resetCodeAge = Math.floor(
      (new Date() - new Date(user.resetPasswordCodeCreatedAt)) / (1000 * 60)
    );
    if (!user.resetPasswordCode || resetCodeAge > 10) {
      // Create a password reset code
      let resetCode = crypto.randomBytes(5).toString("hex").substring(0, 9);

      // Format the reset code
      resetCode = formatCode(resetCode);

      // Store the reset code in the database for the user with the given email
      await prisma.user.update({
        where: { email: email },
        data: {
          resetPasswordCode: resetCode,
          resetPasswordCodeCreatedAt: new Date(),
        },
      });
    }

    // Resend the reset password email with the existing reset code
    await sendResetPasswordEmail(user, user.resetPasswordCode);

    // Return a success response
    res.status(200).json({ message: "Password reset email resent" });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error in resendResetPasswordEmail:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

module.exports = {
  resetPasswordEmail,
  resendResetPasswordEmail,
  verifyResetPasswordCode,
  updatePassword,
};
