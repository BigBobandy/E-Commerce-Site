import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { apiUrl } from "../../helpers/config";
import validatePassword from "../../helpers/validatePassword";
import "../../styles/Modal-Styles/SignUpModal.css";
import ConfirmEmail from "../User-Components/ConfirmEmail";
import PasswordInput from "./PasswordInput";

function SignUpModal({
  setIsSignupModalOpen,
  setIsLoginModalOpen,
  handleResendEmail,
}) {
  // Form field states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendEmailLink, setShowResendEmailLink] = useState(false);

  // Toggle the visibility of the password and confirm password fields
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function for handling submit and sending POST request for the signup process
  async function handleSignUp(e) {
    e.preventDefault();

    // Clears any previous messages
    setMessage(null);

    try {
      // Input validation for all fields
      // Prevent the user from submitting an empty field
      if (firstName.trim() === "" || lastName.trim() === "") {
        setMessage("Names cannot be empty.");
        return;
      }

      // Prevent the user from using numbers or special characters in their name
      if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
        setMessage("Names can only contain letters.");
        return;
      }

      // Check if email and confirm email fields are not empty
      if (!email.trim() || !confirmEmail.trim()) {
        setMessage("Please enter and confirm your email address.");
        return;
      }

      // Check if the email field is in the correct format and isn't empty
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setMessage("Please enter a valid email.");
        return;
      }

      // Check if the entered emails match
      if (!email.trim() !== confirmEmail.trim()) {
        setMessage("Email addresses do not match.");
        return;
      }

      // Check if password and confirm password fields are not empty
      if (!password || !confirmPassword) {
        setMessage("Please enter and confirm your new password.");
        return;
      }

      // Check if the entered passwords match
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      // Validate password strength
      const { score, lengthRequirementMet } = validatePassword(password);
      if (score < 3 || !lengthRequirementMet) {
        setMessage("Your password isn't strong enough.");
        return;
      }

      setLoading(true); // Start loading

      const response = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      // If the server responds with a status of 400 or higher, it means an error has occurred
      if (!response.ok) {
        setMessage(data.error);
      } else {
        setMessage(
          "Successfully signed up! Check your email for a confirmation code."
        );
        // After 10 seconds if the user still hasn't confirmed their email
        // Show the resend email button
        setTimeout(() => {
          setMessage("Still haven't received the confirmation email?");
          setShowResendEmailLink(true);
        }, 10000);
        // Show email confirmation
        setStep(2);
      }
    } catch (error) {
      setMessage("Uh oh! Something went wrong...");
      console.error(error);
    } finally {
      setLoading(false); // Finish loading
    }
  }

  return (
    <div className="modal-container">
      <div className="signup-modal-content">
        <button
          className="modal-close"
          onClick={() => setIsSignupModalOpen(false)}
        >
          Close X
        </button>
        {step === 1 && (
          <form onSubmit={handleSignUp} className="signup-form">
            <h2 className="signup-title">Become a member today!</h2>
            <div className="message-wrapper">
              {message && <div className="message">{message}</div>}
            </div>
            <div className="input-row">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  placeholder="First Name..."
                  type="text"
                  name="first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  placeholder="Last Name..."
                  type="text"
                  name="last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="input-row">
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
                <label htmlFor="confirmEmail">Confirm Email Address</label>
                <input
                  id="confirmEmail"
                  placeholder="Confirm email address..."
                  type="email"
                  name="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    placeholder="Enter a password..."
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
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
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirmPassword"
                    placeholder="Confirm password..."
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
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
            </div>
            <div className="signup-submit-button-wrapper">
              <button type="submit" className="signup-submit-button">
                Sign Up
              </button>
            </div>
            <div className="spinner-container">
              {loading && <div className="spinner"></div>}
            </div>
            <PasswordInput
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              renderInputs={false}
            />
            <div className="signup-login-link-wrapper">
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
            </div>
          </form>
        )}
        {step === 2 && (
          <>
            <ConfirmEmail
              email={email}
              showResendEmailLink={showResendEmailLink}
              setShowResendEmailLink={setShowResendEmailLink}
              handleResendEmail={handleResendEmail}
            />
          </>
        )}
      </div>
    </div>
  );
}
export default SignUpModal;
