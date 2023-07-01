import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import logoImg from "../../assets/borger-logo.png";
import "../../styles/User-Styles/LoginModal.css";
import PasswordChange from "./PasswordChange";
import { UserContext } from "./UserContext";

function LoginModal({ setIsLoginModalOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { login } = useContext(UserContext);
  const [isPasswordChangeShown, setPasswordChangeShown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle the visibility of the password and confirm password fields
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function that makes a POST request to the server on submit to the /login route
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous messages
    setMessage("");
    setErrorMessage(null);

    try {
      // Check if both password and email fields are empty
      if (!password && !email) {
        setMessage("Please enter your email and password.");
        return;
      }

      // Check if email field is empty
      if (!email) {
        setMessage("Please enter your email address.");
        return;
      }

      // Check if password field is empty
      if (!password) {
        setMessage("Please enter your password.");
        return;
      }

      setLoading(true);

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
        const errorData = await response.json(); // This will parse the body of the response to JSON
        throw new Error(errorData.error); // Access the error property of the parsed response
      } else {
        // The response is okay so parse the body of the response into a javascript object
        const data = await response.json();

        // Clear any previous error messages
        setErrorMessage(null);

        // Set success message
        setMessage("Login successful!");

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
          }, 2000);
        } else {
          // Handle the case where no token is returned
          console.log("No token returned");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
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
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  placeholder="Email address..."
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    placeholder="Enter password..."
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    type="button"
                    className="visibility-toggle-button"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
                </div>
              </div>
              <div className="login-button-wrapper">
                <button type="submit" className="login-button">
                  Log In
                </button>
              </div>
              <div className="spinner-container">
                {loading && <div className="spinner"></div>}
              </div>
              <div></div>
            </form>
            <div className="login-content-bottom-wrapper">
              <div className="error-message">{message}</div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
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
