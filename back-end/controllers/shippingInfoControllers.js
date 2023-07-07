const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Handles fetching the user's shipping information
async function getUserShippingInfo(req, res) {
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

    // Fetch and return the shipping info for this user
    const shippingInfo = await prisma.shippingInfo.findMany({
      where: { userId: userId },
    });

    // Return the array of their shipping information
    // This can be an empty array if the user hasn't yet added any addresses to their account yet
    res.json(shippingInfo);
  } catch (error) {
    res
      .status(500)
      .send("Error occurred while fetching user's shipping information.");
  }
}

// Handles setting and unsetting isDefault on a user's shipping addresses
async function setDefaultAddress(req, res) {
  // Get the ID of the address to set as default from the request body
  const { addressId } = req.body;

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

    // First, make sure the address exists and belongs to this user
    const address = await prisma.shippingInfo.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    // If the address doesn't exist or doesn't belong to the user, return an error
    if (!address) {
      return res
        .status(404)
        .json({ error: "Address not found or doesn't belong to the user" });
    }

    // Next, unset the default status for all other addresses of this user
    await prisma.shippingInfo.updateMany({
      where: {
        userId: userId,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then, set the default status for the chosen address
    await prisma.shippingInfo.update({
      where: {
        id: addressId,
        userId: userId, // Make sure this address belongs to the user
      },
      data: { isDefault: true },
    });

    res.status(200).send("Default shipping address updated successfully");
  } catch (error) {
    res
      .status(500)
      .send("Error occurred while updating default shipping address.");
  }
}

// Handles adding a new address for the user
async function addAddress(req, res) {
  // Extract the address details from the request body
  const { address, city, state, stateAbbrev, zip, country, countryAbbrev } =
    req.body;

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

    // Check if the user already has a default address
    // If a default address already exists this will be a truthy value
    // Which means below when creating the new table for the address !defaultAddressExists will be false
    // so the new address won't be set as the default
    // and if a default address doesn't exist defaultAddressExists will be null and
    // !defaultAddressExists will be true, so the new address will be set as the default.
    const defaultAddressExists = await prisma.shippingInfo.findFirst({
      where: { userId, isDefault: true },
    });

    // Add the new address, and if it's the user's first address, set it as the default
    const newAddress = await prisma.shippingInfo.create({
      data: {
        address,
        city,
        state,
        stateAbbrev,
        zip,
        country,
        countryAbbrev,
        userId,
        isDefault: !defaultAddressExists,
      },
    });

    res.status(200).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while adding address.");
  }
}

// Handles deleting an address for a user
async function deleteAddress(req, res) {
  // Get the ID of the address to delete from the request body
  const { addressId } = req.body;

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

    // Find the address with the provided ID that also belongs to the user
    const address = await prisma.shippingInfo.findUnique({
      where: { id: addressId },
    });

    // If the address is not found or doesn't belong to the user, return an error
    if (!address || address.userId !== userId) {
      return res.status(404).json({
        error:
          "Address not found or you're not authorized to delete this address.",
      });
    }

    // Handle the case where we're deleting the default address
    if (address.isDefault) {
      // Find another address of the user to make it the new default
      const newDefaultAddress = await prisma.shippingInfo.findFirst({
        where: { userId, id: { not: addressId } },
      });

      if (newDefaultAddress) {
        // If found, update it to be the new default
        await prisma.shippingInfo.update({
          where: { id: newDefaultAddress.id },
          data: { isDefault: true },
        });
      }
    }

    // Delete the address
    await prisma.shippingInfo.delete({
      where: { id: addressId },
    });

    res.status(200).send("Address deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while deleting address.");
  }
}

module.exports = {
  getUserShippingInfo,
  setDefaultAddress,
  addAddress,
  deleteAddress,
};
