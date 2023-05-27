import { useState } from "react";
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

  // Function for handling submit and sending POST request
  const handleSubmit = async (e) => {
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
        setMessage(
          "Successfully signed up! Check your email for a confirmation code."
        );
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Uh oh! Something went wrong...");
      console.error(err);
    }

    setLoading(false); // Finish loading
  };

  return (
    <div className="sign-up-container">
      <h2>Sign Up!</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
        <button type="submit">Sign Up</button>
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
