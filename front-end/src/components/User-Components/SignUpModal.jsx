import { useState } from "react";
import logoImg from "../../assets/borger-logo.png";
import "../styles/user-styles/SignUpModal.css";

function SignUpModal({ setIsSignupModalOpen, setIsLoginModalOpen }) {
  // Form field states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  // Function for handling submit and sending POST request for the signup process
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Clears any previous errors/messages
    setError(null);
    setMessage(null);

    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      // If the server responds with a status of 400 or higher, it means an error has occurred
      if (!response.ok) {
        setError(data.error);
      } else {
        // Clear form fields after signing up
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        setMessage(
          "Successfully signed up! Check your email for a confirmation code."
        );
      }
    } catch (error) {
      setError("Uh oh! Something went wrong...");
      console.error(error);
    }

    setLoading(false); // Finish loading
  };

  return (
    <div className="signup-modal-container">
      <div className="signup-modal-content">
        <img src={logoImg} alt="Dirt Burger Logo" className="login-logo" />
        <button
          className="signup-modal-close"
          onClick={() => setIsSignupModalOpen(false)}
        >
          X
        </button>
        <h2>Become a member today!</h2>
        <form onSubmit={handleSignUp}>
          <label>
            <input
              placeholder="First Name..."
              type="text"
              name="first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            <input
              placeholder="Last Name..."
              type="text"
              name="last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            <input
              placeholder="Email address..."
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input
              placeholder="Enter a password..."
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{" "}
            <a
              className="signup-link"
              onClick={() => {
                setIsSignupModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            >
              Login here
            </a>
          </p>
          <div className="spinner-container">
            {loading && <div className="spinner"></div>}
          </div>
        </form>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default SignUpModal;