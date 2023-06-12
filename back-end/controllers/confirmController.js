const { PrismaClient } = require("@prisma/client");

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

module.exports = { confirm, confirmCode };
