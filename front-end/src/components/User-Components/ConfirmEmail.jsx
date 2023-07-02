import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user-styles/ConfirmEmail.css";
import { UserContext } from "./UserContext";

function ConfirmEmail({
  email,
  showResendEmailLink,
  setShowResendEmailLink,
  handleResendEmail,
}) {
  // State to hold the value of the input field for the confirmation code
  const [confirmationCode, setConfirmationCode] = useState("");

  // State to hold success message
  const [message, setMessage] = useState(null);

  // State to control loading spinner display
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);

  const navigate = useNavigate();

  // Function to handle clicking the resend confirmation email link
  const handleResend = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setLoading(true); // Start loading
    const success = await handleResendEmail(email); // Send the request to re-send the confirmation email

    // Check if the request was successful
    if (success) {
      setMessage("Confirmation email successfully re-sent.");
      setShowResendEmailLink(false); // Hide the resend email button

      // After 10 seconds if the user still hasn't confirmed their email, show the resend email button again
      setTimeout(() => {
        setMessage("Still haven't received the confirmation email?");
        setShowResendEmailLink(true);
      }, 10000);
    } else {
      // If not, show an error message
      setMessage("Failed to re-send confirmation email. Please try again.");
    }

    setLoading(false); // Finish loading
  };

  // Function to handle email confirmation, triggered on form submission
  const handleEmailConfirmation = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setMessage(null);

    // Try to confirm the email with the provided code
    try {
      // Check if confirmation code field is empty
      if (!confirmationCode) {
        setMessage("Please enter the confirmation code.");
        return;
      }

      setLoading(true); // Start loading

      const response = await fetch("http://localhost:3000/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationCode: confirmationCode }), // Send confirmation code as request body
      });

      const data = await response.json();

      // If response is okay, show success message and redirect to home page after 3 seconds
      if (response.ok) {
        const { user, token } = data; // Deconstruct data object to get user data and JWT
        login({ user, token }); // Log the user in

        setMessage("Congratulations! Your email is now confirmed.");
        // Navigate the user to the home page if they aren't on it already
        setTimeout(() => {
          navigate("/");
          // Forcing a page reload here so that the user information is displayed correctly
          window.location.reload();
        }, 2000);
      } else {
        // If response is not okay, show the error message
        setMessage(data.error);
      }
    } catch (error) {
      // If request fails for any reason, show an error message
      setMessage("An error occurred.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleEmailConfirmation}>
      <div className="confirmation-title-wrapper">
        <h2 className="confirmation-title">Confirm Your Email!</h2>
      </div>
      <p className="confirmation-instructions">
        Check your email for a confirmation code and enter below.
      </p>
      <div>
        <label className="label-wrapper">
          Confirmation Code:
          <input
            type="text"
            placeholder="Confirmation code..."
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)} // Update state with input field value
          />
        </label>
      </div>
      <div className="button-wrapper">
        <button type="submit" className="confirmation-code-submit-button">
          Confirm Email
        </button>
      </div>
      <div className="spinner-container">
        {loading && <div className="spinner"></div>}{" "}
      </div>
      <div className="resend-link-wrapper">
        {message && <div className="message">{message}</div>}{" "}
      </div>
      <div className="resend-link-wrapper">
        {showResendEmailLink && (
          <a onClick={handleResend} className="resend-link">
            Re-send confirmation email
          </a>
        )}
      </div>
    </form>
  );
}

export default ConfirmEmail;
