// Function to mask the card number except for the last four digits
// and formats it by placing a space every 4 chars
export function maskCardNumber(cardNumber) {
  // Remove spaces from the card number
  const noSpaceCardNumber = cardNumber.replace(/ /g, "");

  // Get the last four digits
  const lastFourDigits = noSpaceCardNumber.slice(-4);

  // Create the mask
  const mask = "*".repeat(noSpaceCardNumber.length - 4);

  // Combine mask with last four digits
  const maskedCardNumber = mask + lastFourDigits;

  // Insert spaces every four characters
  const formattedCardNumber = maskedCardNumber.replace(/(.{4})/g, "$1 ").trim();

  return formattedCardNumber;
}

// Function to get the last four digits of a card
export const getLastFourDigits = (cardNumber) => {
  if (cardNumber.length >= 4) {
    return cardNumber.slice(-4);
  }
  return "Invalid Card";
};
