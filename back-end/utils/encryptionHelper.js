const crypto = require("crypto");
require("dotenv").config({ path: "../.env" });

// Extract the encryption key from the environment variables; it needs to be 256 bits
if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set");
}

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// Define the encryption algorithm to be used; 'aes-256-cbc' is a popular and secure choice
const ALGORITHM = "aes-256-cbc";

// Specify the length of the initialization vector (IV), which adds randomness to encryption. For AES, this is 16 bytes.
const IV_LENGTH = 16;

// Function to encrypt a given text
function encrypt(text) {
  if (typeof text === "function") {
    throw new Error("Invalid argument: function received, string expected");
  }

  // Generate a cryptographically strong random Initialization Vector
  let iv = crypto.randomBytes(IV_LENGTH);

  // Create a new cipher using the algorithm, key, and iv
  let cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return the iv and the encrypted text, both of which are needed for decryption
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Function to decrypt a given text
function decrypt(text) {
  // The encrypted text will have the format 'iv:encryptedText'. Split it into these two parts.
  let textParts = text.split(":");

  // The IV was the first part of the text. Remove it from textParts and convert it from hexadecimal to a Buffer.
  let iv = Buffer.from(textParts.shift(), "hex");

  // The remaining text is the encrypted text. Join it back together in case there were any colons in it and convert it from hexadecimal to a Buffer.
  let encryptedText = Buffer.from(textParts.join(":"), "hex");

  // Create a new decipher using the algorithm, key, and IV.
  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  // Decrypt the encrypted text.
  let decrypted = decipher.update(encryptedText);

  // When the decipher finalizes (i.e., when all the encrypted text has been processed), it might output a few more bytes of plaintext. Concatenate this with the previously decrypted text.
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Convert the decrypted text (which is a Buffer) into a string and return it.
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
