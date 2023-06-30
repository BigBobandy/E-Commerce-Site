import { useContext, useState } from "react";
import logoImg from "../../assets/borger-logo.png";
import "../../styles/User-Styles/LoginModal.css";
import PasswordChange from "./PasswordChange";
import { UserContext } from "./UserContext";

function LoginModal({ setIsLoginModalOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { login } = useContext(UserContext);
  const [isPasswordChangeShown, setPasswordChangeShown] = useState(false);

  // Function that makes a POST request to the server on submit to the /login route
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Passing the email and password the user submitted in the body of the request
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // If response isn't okay throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // The response is okay so parse the body of the response into a javascript object
        const data = await response.json();

        // Call the login function from the context
        login(data);

        // Check if the data includes a token property
        // If it does store the token in local storage
        if (data.token) {
          localStorage.setItem("token", data.token); // Store the JWT in localStorage for later use

          // Close the login modal after successful login
          setTimeout(() => {
            setIsLoginModalOpen(false);
            // Forcing a page reload here so that the user information is displayed correctly
            window.location.reload();
          }, 1000);
        } else {
          // Handle the case where no token is returned
          console.log("No token returned");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-modal-container">
      <div className="login-modal-content">
        <div className="login-logo-wrapper">
          <img src={logoImg} alt="Dirt Burger Logo" className="login-logo" />
          <button
            className="login-modal-close"
            onClick={() => setIsLoginModalOpen(false)}
          >
            X
          </button>
        </div>
        {isPasswordChangeShown ? (
          <PasswordChange setPasswordChangeShown={setPasswordChangeShown} />
        ) : (
          <>
            <h2>Member Login</h2>
            <form onSubmit={handleSubmit} className="login-form-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="login-button-wrapper">
                <button type="submit" className="login-button">
                  Log In
                </button>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <div></div>
            </form>
            <div className="login-content-bottom-wrapper">
              <a onClick={() => setPasswordChangeShown(true)}>
                Forgot your password?
              </a>
              <a>Resend confirmation email</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
