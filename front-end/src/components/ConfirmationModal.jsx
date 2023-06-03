import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ConfirmationModal.css";

function ConfirmationModal({ onClose }) {
  // State to hold the value of the input field for the confirmation code
  const [confirmationCode, setConfirmationCode] = useState("");

  // State to hold any error messages
  const [error, setError] = useState(null);

  // State to hold success message
  const [message, setMessage] = useState(null);

  // State to control loading spinner display
  const [loading, setLoading] = useState(false);

  // Instantiating the navigate function from react-router-dom for redirection after confirmation
  const navigate = useNavigate();

  // Function to handle email confirmation, triggered on form submission
  const handleEmailConfirmation = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clears any previous errors/messages
    setError(null);
    setMessage(null);

    setLoading(true); // Start loading

    // Try to confirm the email with the provided code
    try {
      const response = await fetch("http://localhost:3000/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationCode: confirmationCode }), // Send confirmation code as request body
      });

      const data = await response.json();

      // If response is okay, show success message and redirect to home page after 3 seconds
      if (response.ok) {
        setMessage("Congratulations! Your email is now confirmed.");
        setTimeout(() => {
          onClose(); // Close the modal
          navigate("/"); // Navigate to the home page
        }, 5000); // Close the modal after 5 seconds
      } else {
        // If response is not okay, show the error message
        setError(data.error);
      }
    } catch (error) {
      // If request fails for any reason, show an error message
      setError("An error occurred.");
    }

    setLoading(false); // End loading
  };

  return (
    <div className="confirmation-modal">
      <button id="close-button" onClick={onClose}>
        🞮
      </button>
      <form onSubmit={handleEmailConfirmation}>
        <h2>Confirm Your Email!</h2>
        <label>
          Confirmation Code:
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)} // Update state with input field value
          />
        </label>
        <button type="submit">Confirm Email</button>
        <div className="spinner-container">
          {loading && <div className="spinner"></div>}{" "}
        </div>
        {error && <div className="error">{error}</div>}{" "}
        {message && <div className="message">{message}</div>}{" "}
      </form>
    </div>
  );
}

export default ConfirmationModal;
