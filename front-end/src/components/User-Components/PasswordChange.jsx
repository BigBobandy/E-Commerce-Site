import { useState } from "react";

function PasswordChange({ setModalContent }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  async function handleEmailSubmit(e) {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    // Send the email to server
    // ... server logic ...

    // If email is sent successfully, move to the next step
    setStep(2);
  }

  async function handleCodeSubmit(e) {
    e.preventDefault();

    if (!code) {
      setMessage("Please enter the reset code.");
      return;
    }

    // Verify the code with the server
    // ... server logic ...

    // If code verification is successful, move to the next step
    setStep(3);
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Send new password to the server
    // ... server logic ...

    // If password reset is successful, revert back to default modal content
    setModalContent("default");
  }

  return (
    <div>
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button type="submit">Send reset code</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleCodeSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter reset code"
          />
          <button type="submit">Verify code</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <button type="submit">Reset password</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default PasswordChange;
