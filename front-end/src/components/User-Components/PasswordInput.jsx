import { useEffect, useState } from "react";
import validatePassword from "../../helpers/validatePassword";

function PasswordInput({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  handlePasswordSubmit,
  renderInputs = true,
}) {
  // Local state to hold the validation results of the password
  const [passwordValidation, setPasswordValidation] = useState({
    score: 0, // The score for the password strength
    lengthRequirementMet: false, // Whether the password length requirement has been met
  });

  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

  // Function to handle changes to the password input field
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value; // Get the current input value
    setPassword(newPassword); // Update the parent component's password state
    setPasswordValidation(validatePassword(newPassword)); // Validate the new password and update the local validation state
  };

  // Render the password input form
  return (
    <div className="password-change-form-wrapper">
      {renderInputs && (
        <>
          <p>Enter and confirm your new password.</p>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          <button
            type="submit"
            className="password-change-button"
            onClick={handlePasswordSubmit}
          >
            Reset password
          </button>
        </>
      )}
      <div className="password-strength">
        <div className="progress-bar-wrapper">
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${
                passwordValidation.score >= 4
                  ? "green"
                  : passwordValidation.score === 3
                  ? "orange"
                  : "red"
              }`}
              style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="password-strength-text-wrapper">
          <p
            className={`password-strength-text ${
              passwordValidation.score >= 3 ? "valid" : ""
            }`}
          >
            Password strength: {passwordValidation.score}/5{" "}
            {passwordValidation.score >= 3 && <span>&#10003;</span>}
          </p>
        </div>
      </div>
      <div className="password-message-wrapper">
        <ul className="password-requirements">
          <li className={password.length >= 8 ? "met" : ""}>
            At least 8 characters long
          </li>
          <li className={/[a-z]/.test(password) ? "met" : ""}>
            Contains a lowercase letter
          </li>
          <li className={/[A-Z]/.test(password) ? "met" : ""}>
            Contains an uppercase letter
          </li>
          <li className={/\d/.test(password) ? "met" : ""}>
            Contains a number
          </li>
          <li className={/\W/.test(password) ? "met" : ""}>
            Contains a special character
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PasswordInput;
