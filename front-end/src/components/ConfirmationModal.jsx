import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ConfirmationModal.css";

function ConfirmationModal({ email, onClose }) {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailConfirmation = async (e) => {
    e.preventDefault();

    // Clears any previous errors/messages
    setError(null);
    setMessage(null);
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: confirmationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Congratulations! Your email is now confirmed.");
        setTimeout(() => {
          onClose();
          navigate("/"); // Navigate to the home page after confirmation
        }, 2000); // Close the modal after 2 seconds
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred.");
    }

    setLoading(false);
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
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
        </label>
        <button type="submit">Confirm Email</button>
        <div className="spinner-container">
          {loading && <div className="spinner"></div>}
        </div>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default ConfirmationModal;
