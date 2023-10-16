import { useState } from "react";
import { apiUrl } from "../../helpers/config";
import "../../styles/Checkout-Styles/GuestInfo.css";

function GuestInfo({ guestInfo, setGuestInfo, setIsGuest, setUser }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handles changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo({
      ...guestInfo,
      [name]: value,
    });
  };

  // Handles sending POST request to create a guest user
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUser(null);

    // Clear any previous messages
    setMessage("");

    const { firstName, lastName, email, confirmEmail } = guestInfo;

    // Input validation for all fields
    // Prevent the user from submitting an empty field
    if (firstName.trim() === "" || lastName.trim() === "") {
      setMessage("Names cannot be empty.");
      return;
    }

    // Prevent the user from using numbers or special characters in their name
    if (
      !/^[a-zA-Z]+$/.test(firstName.trim()) ||
      !/^[a-zA-Z]+$/.test(lastName.trim())
    ) {
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
    if (email.trim() !== confirmEmail.trim()) {
      setMessage("Email addresses do not match.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/signup/createGuest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestInfo),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Guest data from response:", data);

        setIsGuest(true);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="guest-checkout-parent">
      <div className="guest-checkout-header">
        <h2>Guest Checkout</h2>
      </div>
      <form onSubmit={handleSubmit} className="guest-checkout-form">
        <h4>{message}</h4>
        <div className="input-row">
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={guestInfo.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={guestInfo.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="input-row">
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={guestInfo.email}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="confirmEmail">Confirm Email Address</label>
            <input
              id="confirmEmail"
              placeholder="Confirm Email"
              type="email"
              name="confirmEmail"
              value={guestInfo.confirmEmail}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="message-wrapper">
          {isLoading ? (
            <div className="spinner-container">
              {isLoading && <div className="spinner"></div>}
            </div>
          ) : (
            <>
              <button type="submit">Continue as Guest</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default GuestInfo;
