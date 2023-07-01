import { useState } from "react";
import validatePassword from "../../helpers/validatePassword";
import "../../styles/User-Styles/PasswordChange.css";
import PasswordInput from "./PasswordInput";

function PasswordChange({ setPasswordChangeShown }) {
  // State variables to hold user input and process status
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Function to handle email submission and send reset code
  // Step 1
  async function handleEmailSubmit(e) {
    // Prevent default form submission behavior
    e.preventDefault();

    setLoading(true); // Start loading

    try {
      // Check if email is entered
      if (!email) {
        setMessage("Please enter your email.");
        return;
      }

      // Send the email the user entered to server
      const response = await fetch(
        "http://localhost:3000/api/password/reset-password",
        {
          method: "POST", // Type of request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Check if the server's response is ok (status in the range 200-299)
      if (response.ok) {
        setMessage("Password reset email successfully sent.");

        setTimeout(() => {
          setStep(2);
        }, 1000);
      } else {
        // If not, show an error message
        setMessage("Failed to send reset code. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while resetting password.");
    } finally {
      setLoading(false); // Finish loading
    }
  }

  // Function to handle code submission and verify reset code
  // Step 2
  async function handleCodeSubmit(e) {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      if (!code) {
        setMessage("Please enter the reset code.");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/password/verify-reset-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }), // Send both email and code for verification
        }
      );

      if (response.ok) {
        setMessage("Reset code confirmed successfully.");
        setStep(3);
        setMessage("");
      } else {
        setMessage("Invalid reset code. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while verifying the reset code.");
    } finally {
      setLoading(false); // Finish loading
    }
  }

  // Function to handle password submission and reset password
  // Step 3
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // Check if password and confirm password fields are not empty
      if (!password || !confirmPassword) {
        setMessage("Please enter and confirm your new password.");
        return;
      }

      // Check if the entered passwords match
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      // Validate password strength
      const { score, lengthRequirementMet } = validatePassword(password);
      if (score < 3 || !lengthRequirementMet) {
        setMessage("Your password isn't strong enough.");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/password/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send both email and new password to the server
        }
      );

      if (response.ok) {
        // Set success message
        setMessage("Password has been changed successfully!");

        // Delay the execution of the function that switches the modal content
        // to let the success message render
        setTimeout(() => {
          setPasswordChangeShown(false);
        }, 2000); // Delay of 2 seconds
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("");
      setMessage("An error occurred while updating the password.");
    } finally {
      setLoading(false); // Finish loading
    }
  }

  return (
    <div className="password-change-container">
      {step === 1 && (
        <form
          onSubmit={handleEmailSubmit}
          className="password-change-form-wrapper"
        >
          <div className="step-message-wrapper">
            <h4 className="step-message-h4 ">Need to change your password?</h4>
            <p className="step-message">
              Don't worry we got you covered. Just enter your email below.
            </p>
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button type="submit" className="password-change-button">
            Send reset code
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleCodeSubmit}
          className="password-change-form-wrapper"
        >
          <div className="step-message-wrapper">
            <p className="step-message">
              Check your email for a reset code and enter it below.
            </p>
          </div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter reset code"
          />
          <button type="submit" className="password-change-button">
            Verify code
          </button>
        </form>
      )}

      {step === 3 && (
        <PasswordInput
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          handlePasswordSubmit={handlePasswordSubmit}
        />
      )}
      <div className="spinner-container">
        {loading && <div className="spinner"></div>}
      </div>
      {message && <p className="password-change-message">{message}</p>}
    </div>
  );
}

export default PasswordChange;
