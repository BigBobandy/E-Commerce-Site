import { useEffect, useState } from "react";
import { apiUrl } from "../../helpers/config";
import "../../styles/Modal-Styles/ContactUsModal.css";

function ContactUsModal({ setIsContactUsModalOpen }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // useEffect that runs whenever message changes
  // The purpose of this useEffect is to clear any message after a timeout so that they don't linger forever
  useEffect(() => {
    // Declare a variable for the timeout ID to use for clearing the timeout later
    let timeoutId;

    // If message exists (is truthy), then start a timeout
    if (message) {
      // Set a timeout to clear the message after 15 seconds and assign the timeout ID to timeoutId
      timeoutId = setTimeout(() => {
        setMessage("");
      }, 15000);
    }

    // Return a cleanup function to be run before the next call to useEffect and on unmount
    return () => {
      // If a timeout was started (i.e., timeoutId is truthy), clear the timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]); // Run this effect whenever the `message` state changes

  // Handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles form submission, sends an email to support
  async function handleSubmit(e) {
    e.preventDefault();

    // Clear any previous messages
    setMessage("");

    // Input validation
    // Destructure the formData object for readability
    const { name, email, subject, message } = formData;

    // Name validation
    if (name.trim() === "") {
      setMessage("Names cannot be empty.");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      setMessage("Names can only contain letters and spaces.");
      return;
    }

    // Check if the email field is in the correct format and isn't empty
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (!subject.trim()) {
      setMessage("Please fill out the subject field.");
      return;
    }

    if (!message.trim() || message.length < 10) {
      setMessage(
        "The message field cannot be empty and must contain at least 10 characters."
      );
      return;
    }

    // Now that input is validated, start loading and try to send the request
    setIsLoading(true);

    // Declare response variable outside of try block so that it can be accessed by the catch block
    let response;

    // Try to send the request
    try {
      response = await fetch(`${apiUrl}/api/contact/send-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);
      setMessage(
        "Email sent successfully. Dirty Burger support will be in touch soon!"
      );

      // Close the ContactUsModal after 5 seconds
      setTimeout(() => {
        setIsContactUsModalOpen(false);
      }, 5000);

      // Handle any errors
    } catch (error) {
      setIsLoading(false);

      // If the status code is 429, it means the user has made too many requests
      if (response && response.status === 429) {
        setMessage("You've made too many requests. Please try again later.");
      } else {
        setMessage(
          "An error occurred while sending the email. Please try again later."
        );
      }
    }
  }
  return (
    <div className="modal-container">
      <div className="contact-modal-container">
        <div className="modal-header-container">
          <h1>Contact Us</h1>

          <button
            className="modal-close"
            onClick={() => setIsContactUsModalOpen(false)}
          >
            Close X
          </button>
        </div>
        <div className="modal-content-container">
          <div className="message-wrapper">
            <h4>{message}</h4>
          </div>
          <p>Have questions or need assistance? We're here to help.</p>

          <form onSubmit={handleSubmit} className="contact-us-form">
            <div className="contact-input-row">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="contact-input-row">
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="contact-input-row">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="contact-input-row">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                htmlFor="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="message-wrapper">
              {isLoading ? (
                <div className="spinner-container">
                  {isLoading && <div className="spinner"></div>}
                </div>
              ) : (
                <>
                  <button type="submit">Send Message</button>
                </>
              )}
            </div>
          </form>
        </div>
        <div className="modal-footer-container">
          {" "}
          <p>You could also just email dirtburgerdev@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUsModal;
