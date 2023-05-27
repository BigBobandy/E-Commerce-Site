import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/EmailConfirmation.css";

function EmailConfirmation() {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefualt();

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

        body: JSON.stringify({ confirmationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmationCode("");
        setMessage(data.message);
        // Email confirmation is successfull so user gets redirected to the home page
        navigate("/");
      } else {
        // oh no there's an error. display it
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="email-confirmation-container">
      <Link to="/">Go to Home</Link>
      <h2>Confirm Your Email!</h2>
      <form onSubmit={handleSubmit}>
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
      </form>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default EmailConfirmation;
