const { encrypt, decrypt } = require("../utils/encryptionHelper");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Handles adding a new card for the user
async function createCardInfo(req, res) {
  // First get the card data from the request body
  const { cardType, cardNumber, expiryDate, cvv, cardHolder } = req.body;

  // Get the JWT from the Authorization header
  const token = req.header("Authorization").replace("Bearer ", "");

  // Declare a variable to hold the decoded token
  let decoded;
  try {
    try {
      // Try to verify and decode the JWT using the secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If jwt.verify() throws an error, catch it and log the error
      console.log(err);

      // Return a 401 status code (Unauthorized) and a relevant error message
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    // Get the user ID from the decoded token
    const userId = decoded.id;

    // Check that all the required fields for creating cardInfo are present
    // I can't think of a situation where all of them wouldn't be present but it doesn't hurt to check?
    if (!cardType || !cardNumber || !expiryDate || !cvv || !cardHolder) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already has a default card
    const defaultCardExists = await prisma.cardInfo.findFirst({
      where: { userId, isDefault: true },
    });

    // Create the encrypted card object for database storage
    const encryptedCard = {
      userId: userId,
      cardType: encrypt(cardType),
      cardNumber: encrypt(cardNumber),
      expiryDate: encrypt(expiryDate),
      cvv: encrypt(cvv),
      cardHolder: encrypt(cardHolder),
      isDefault: !defaultCardExists,
    };

    // Create a new cardInfo in the database
    const newCard = await prisma.cardInfo.create({
      data: encryptedCard,
    });

    // Create the unencrypted card object for the front-end
    const unencryptedCard = {
      userId: userId,
      cardType: cardType,
      cardNumber: cardNumber,
      expiryDate: expiryDate,
      cvv: cvv,
      cardHolder: cardHolder,
      isDefault: !defaultCardExists,
      id: newCard.id, // get the id of the new card that was created and pass it
    };

    // And send the unencrypted card object back in the response
    return res.status(201).json(unencryptedCard);
  } catch (error) {
    console.error(error);
    // If anything goes wrong, we send back an error message
    return res
      .status(500)
      .json({ error: "There was a problem creating the card info" });
  }
}

// Handles setting and unsetting isDefault on a user's cards
async function setDefaultCard(req, res) {
  // Get the ID of the card to set as default from the request body
  const { cardId } = req.body;

  try {
    // Get the JWT from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Declare a variable to hold the decoded token
    let decoded;

    try {
      // Try to verify and decode the JWT using the secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If jwt.verify() throws an error, catch it and log the error
      console.log(err);

      // Return a 401 status code (Unauthorized) and a relevant error message
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    // Get the user ID from the decoded token
    const userId = decoded.id;

    // First, make sure the card exists and belongs to this user
    const card = await prisma.cardInfo.findFirst({
      where: {
        id: cardId,
        userId: userId,
      },
    });

    // If the card doesn't exist or doesn't belong to the user, return an error
    if (!card) {
      return res
        .status(404)
        .json({ error: "Card not found or doesn't belong to the user" });
    }

    // Next, unset the default status for all other cards of this user
    await prisma.cardInfo.updateMany({
      where: {
        userId: userId,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then, set the default status for the chosen card
    await prisma.cardInfo.update({
      where: {
        id: cardId,
      },
      data: { isDefault: true },
    });
    res.status(200).json({ message: "Default card updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred while updating default card.");
  }
}

// Handles fetching the user's card info
async function getCardInfo(req, res) {
  // Get the JWT from the Authorization header
  const token = req.header("Authorization").replace("Bearer ", "");

  // Declare a variable to hold the decoded token
  let decoded;
  try {
    try {
      // Try to verify and decode the JWT using the secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If jwt.verify() throws an error, catch it and log the error
      console.log(err);

      // Return a 401 status code (Unauthorized) and a relevant error message
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    // Get the user ID from the decoded token
    const userId = decoded.id;

    // Retrieve the user's card information from the database
    const cardInfo = await prisma.cardInfo.findMany({
      where: {
        userId: Number(userId),
      },
    });

    if (!cardInfo) {
      // If no card info found, return a 404 error
      return res
        .status(404)
        .json({ error: "No card info found for this user" });
    }

    // Decrypt the sensitive card information
    const decryptedCardInfos = cardInfo.map((info) => ({
      ...info,
      cardType: decrypt(info.cardType),
      cardNumber: decrypt(info.cardNumber),
      expiryDate: decrypt(info.expiryDate),
      cvv: decrypt(info.cvv),
      cardHolder: decrypt(info.cardHolder),
    }));

    // Return the decrypted card information
    return res.json(decryptedCardInfos);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a generic error message
    return res
      .status(500)
      .json({ error: "There was a problem processing your request." });
  }
}

// Handles deleting a card for a user
async function deleteCard(req, res) {
  // Get the ID of the card to delete request params and convert it from string to an integer
  const cardId = parseInt(req.params.cardId);

  try {
    // Get the JWT from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Declare a variable to hold the decoded token
    let decoded;

    try {
      // Try to verify and decode the JWT using the secret
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If jwt.verify() throws an error, catch it and log the error
      console.log(err);

      // Return a 401 status code (Unauthorized) and a relevant error message
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    // Get the user ID from the decoded token
    const userId = decoded.id;

    // Find the card with the provided ID that also belongs to the user
    const card = await prisma.cardInfo.findUnique({
      where: { id: cardId },
    });

    // If the card is not found or doesn't belong to the user, return an error
    if (!card || card.userId !== userId) {
      return res.status(404).json({
        error: "Card not found or you're not authorized to delete this card.",
      });
    }

    // Handle the case where the card being deleted is set as default
    let newDefaultCard;

    // Check if the card that is being deleted is currently set as the user's default card
    if (card.isDefault) {
      // Find another card of the user to make it the new default
      newDefaultCard = await prisma.cardInfo.findFirst({
        where: { userId, id: { not: cardId } },
      });

      if (newDefaultCard) {
        // If found, update it to be the new default
        await prisma.cardInfo.update({
          where: { id: newDefaultCard.id },
          data: { isDefault: true },
        });
      }
    }

    // Delete the card
    await prisma.cardInfo.delete({
      where: { id: cardId },
    });

    // If there is a new default card, send it in the response
    // otherwise send an empty object
    let responseMessage;
    if (newDefaultCard) {
      responseMessage = {
        message: "Card deleted successfully",
        defaultCard: newDefaultCard,
      };
    } else {
      responseMessage = {
        message: "Card deleted successfully",
        defaultCard: {},
      };
    }

    res.status(200).json(responseMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while deleting card.");
  }
}

module.exports = { createCardInfo, getCardInfo, setDefaultCard, deleteCard };
