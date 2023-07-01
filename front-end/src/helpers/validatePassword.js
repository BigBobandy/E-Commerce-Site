// Function to validate password strength
function validatePassword(password) {
  let score = 0;
  let lengthRequirementMet = false;

  if (/[a-z]/.test(password)) score++; // lower case
  if (/[A-Z]/.test(password)) score++; // upper case
  if (/\d/.test(password)) score++; // number
  if (/\W/.test(password)) score++; // special character

  // check length separately
  if (password.length >= 8) {
    score++;
    lengthRequirementMet = true;
  }

  return { score, lengthRequirementMet };
}

export default validatePassword;
