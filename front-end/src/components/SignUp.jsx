import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  // Will be used later for navigating the user to the login page once that has been implemented
  // if they already have an account and would like to sign in
  const navigate = useNavigate();

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
        // Clear form fields after signing up
        setName("");
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
    <div className="sign-up-container">
      <p>
        <Link to="/">Go to Home</Link>
      </p>
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
        <p>
          <Link to="/">Already have an account? Sign in</Link>
        </p>
        <div className="spinner-container">
          {loading && <div className="spinner"></div>}
        </div>
      </form>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default SignUp;
