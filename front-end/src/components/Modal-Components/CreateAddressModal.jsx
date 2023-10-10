import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../../styles/Modal-Styles/CreateAddressModal.css";
import AddressForm from "../User-Components/AddressForm";

function CreateAddressModal({ setIsCreateAddressModalOpen, setAddresses }) {
  const [acknowledgeDisclaimer, setAcknowledgeDisclaimer] = useState(false);
  const [message, setMessage] = useState("");
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    country: "United States of America",
    countryAbbrev: "US",
  });

  // handler for form submission
  async function handleAddAddress(e) {
    e.preventDefault();

    // Clear any previous messages
    setMessage("");

    // Perform input validation
    const { firstName, lastName, address, city, state, zip, country } =
      newAddress;
    if (
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !country
    ) {
      setMessage("Please fill out all fields.");
      return;
    }

    // Check the zip code is in a valid format
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(zip)) {
      setMessage("Please provide a valid ZIP code.");
      return;
    }

    // User must acknowledge disclaimer before submitting address
    if (!acknowledgeDisclaimer) {
      setMessage("Please acknowledge the disclaimer before proceeding.");
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
        const errorData = await response.json();

        throw new Error(errorData.error); // Access the error property of the parsed response
      }

      // if the request was successful, add the new address to the addresses array
      const data = await response.json();
      setMessage("Address added successfully!");
      setAddresses((prevAddresses) => [...prevAddresses, data]);
      setNewAddress({});

      setTimeout(() => {
        setIsCreateAddressModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Error adding address: ", err);
      setMessage(err.message);
    }
  }

  return (
    <div className="modal-container">
      <div className="create-address-modal-content">
        <div className="create-address-modal-header">
          <h2>Add a new address</h2>
          <button
            className="modal-close"
            onClick={() => setIsCreateAddressModalOpen(false)}
          >
            Close X
          </button>
          <div className="message-wrapper">
            {message && <p className="submit-message message">{message}</p>}
          </div>
        </div>
        <AddressForm newAddress={newAddress} setNewAddress={setNewAddress} />
        <div className="disclaimer-container">
          <h4 className="disclaimer">
            Disclaimer: This site is a portfolio demonstration and does not
            process real transactions. Please do not enter any real payment or
            address information.
          </h4>
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
        </div>
        <div className="button-wrapper">
          <button
            className="submit-button"
            type="submit"
            onClick={handleAddAddress}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAddressModal;
