import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../../styles/User-Styles/CreateAddressModal.css";

function CreateAddressModal({ setIsCreateAddressModalOpen, setAddresses }) {
  const [message, setMessage] = useState("");
  const [newAddress, setNewAddress] = useState({});
  const [acknowledgeDisclaimer, setAcknowledgeDisclaimer] = useState(false); // New state

  // handler for form input changes
  function handleInputChange(e) {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  }

  // handler for form submission
  async function handleAddAddress(e) {
    e.preventDefault();

    // Clear any previous messages
    setMessage("");

    // User must acknowledge disclaimer before submitting address
    if (!acknowledgeDisclaimer) {
      setMessage("Please acknowledge the disclaimer before proceeding.");
      return;
    }

    // Perform input validation
    const { address, city, state, zip, country } = newAddress;
    if (!address || !city || !state || !zip || !country) {
      setMessage("Please fill out all fields.");
      return;
    }

    // Regex pattern for ZIP code validation (US format)
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(zip)) {
      setMessage("Please provide a valid ZIP code.");
      return;
    }

    // get the JWT from local storage
    const token = localStorage.getItem("token");

    try {
      // make the POST request to add the address
      const response = await fetch(
        "http://localhost:3000/api/shipping-info/add-address",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        }
      );

      // If response isn't okay throw an error and display it
      if (!response.ok) {
        const errorData = await response.json(); // This will parse the body of the response to JSON

        throw new Error(errorData.error); // Access the error property of the parsed response
      }

      // if the request was successful, switch back to 'view' mode and add the new address to the addresses array
      const data = await response.json();
      setMessage("Address added successfully!");
      setAddresses((prevAddresses) => [...prevAddresses, data]);
      setNewAddress({});

      setTimeout(() => {
        setIsCreateAddressModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Error adding address:", err);
      setMessage(err.message);
    }
  }

  return (
    <div className="create-address-modal-container">
      <div className="create-address-modal-content">
        <div className="create-address-modal-header">
          <h2>Add a new address</h2>

          <button
            className="billing-info-modal-close"
            onClick={() => setIsCreateAddressModalOpen(false)}
          >
            X
          </button>
        </div>
        <form onSubmit={handleAddAddress} className="add-address-form">
          <div className="field">
            <label htmlFor="address">Street</label>
            <input
              id="address"
              type="text"
              name="address"
              value={newAddress.address || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={newAddress.city || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="zip">Zip Code</label>
            <input
              id="zip"
              type="text"
              name="zip"
              value={newAddress.zip || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              name="state"
              value={newAddress.state || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              name="country"
              value={newAddress.country || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="disclaimer-container">
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="hidden-checkbox"
                checked={acknowledgeDisclaimer}
                onChange={(e) => setAcknowledgeDisclaimer(e.target.checked)}
              />
              <span className="custom-checkbox">
                {acknowledgeDisclaimer && <FontAwesomeIcon icon={faCheck} />}
              </span>
            </label>
            <h4 className="disclaimer-text address-form-small">
              Disclaimer: This site is a portfolio demonstration and does not
              process real transactions. Please do not enter any real payment or
              address information.
            </h4>
          </div>
          <div className="button-wrapper">
            <button className="submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>
        {message && <p className="signup-message submit-message">{message}</p>}
      </div>
    </div>
  );
}

export default CreateAddressModal;
