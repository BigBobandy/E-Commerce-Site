const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// The function to find a user by their confirmation code.
// It uses Prisma's findFirst method to return the first user it finds
// with a matching email confirmation code.
async function findUserByCode(confirmationCode) {
  return await prisma.user.findFirst({
    where: { emailConfirmationCode: confirmationCode },
  });
}

// handling manual email confirmation using the confirmation modal
async function confirm(req, res) {
  try {
    const { confirmationCode } = req.body; // get the email confirmation code from the request body

    // Search the database for the user with the matching email confirmation code
    const user = await findUserByCode(confirmationCode);

    // If user does not exist, or code does not match, send an error message
    if (!user || user.emailConfirmationCode !== confirmationCode) {
      return res.status(400).json({ error: "Invalid code." });
    }

    // Calculate the difference in minutes between the current time and when the code was created
    const codeAge = Math.floor(
      (new Date() - new Date(user.emailConfirmationCodeCreatedAt)) / (1000 * 60)
    );

    // Check if the code is older than 10 minutes
    if (codeAge > 10) {
      return res.status(400).json({ error: "Confirmation code expired." });
    }

    // If user exists, the code matches and is not expired, confirm the user
    await prisma.user.update({
      where: { id: user.id }, // update using the id
      data: {
        emailConfirmationCode: null, // Clear the confirmation code since it's not needed anymore
        emailConfirmationCodeCreatedAt: null, // Clear the confirmation code creation time
        isEmailConfirmed: true, // Set the user's email confirmation status to true
      },
    });

    // The user's email is now confirmed, so create a JWT so they can be logged in automatically
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    // Send back a success message, JWT and user's data to the client
    res.json({ message: "User email confirmed!", user, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while confirming email." });
  }
}
module.exports = { confirm };
