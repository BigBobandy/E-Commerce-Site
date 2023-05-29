import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import "./styles/SignUp.css";

function SignUp() {
  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Messages states
  // 'error' state will be used to display an error message if there's a problem during the sign-up process.
  const [error, setError] = useState(null);
  // 'message' state will be used to display a success message after the user has successfully signed up.
  // both are initialized to null because there is nothing to display at first
  const [message, setMessage] = useState(null);
  // State for the loading animation
  const [loading, setLoading] = useState(false);
  // state for a popup that will let the user confirm their email
  const [showModal, setShowModal] = useState(false);
  // State for storing user email so it can be passed to the confirmation component
  const [modalEmail, setModalEmail] = useState("");

  // Function for handling submit and sending POST request for the signup process
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Clears any previous errors/messages
    setError(null);
    setMessage(null);

    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // If the server responds with a status of 400 or higher, it means an error has occurred
      if (!response.ok) {
        setError(data.error);
      } else {
        // Store the current email in the modal's state
        setModalEmail(email);

        // Clear form fields
        setName("");
        setEmail("");
        setPassword("");

        // Open the modal for confirming user email
        setShowModal(true);

        setMessage(
          "Successfully signed up! Check your email for a confirmation code."
        );
      }
    } catch (err) {
      setError("Uh oh! Something went wrong...");
      console.error(err);
    }

    setLoading(false); // Finish loading
  };

  return (
    <div className="sign-up-container">
      <Link to="/">Go to Home</Link>
      <h2>Sign Up!</h2>
      <hr />
      <form onSubmit={handleSignUp}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign Up</button>
        <div className="spinner-container">
          {loading && <div className="spinner"></div>}
        </div>
      </form>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      {showModal && (
        <ConfirmationModal
          email={modalEmail}
          onClose={() => {
            setShowModal(false);
            setModalEmail("");
          }}
        />
      )}
    </div>
  );
}
export default SignUp;
