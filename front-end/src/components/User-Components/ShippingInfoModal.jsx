import { useContext, useState } from "react";
import "../../styles/User-Styles/ShippingInfoModal.css";
import CreateAddressModal from "./CreateAddressModal";
import { UserContext } from "./UserContext";

function ShippingInfoModal({ setIsShippingInfoModalOpen }) {
  const [isCreateAddressModalOpen, setIsCreateAddressModalOpen] =
    useState(false);
  const { addresses, setAddresses } = useContext(UserContext); // Get the user's address information from context
  const [message, setMessage] = useState("");

  // Function to handle setting a user's address as default
  async function setDefault(addressId) {
    // Clear any previous messages
    setMessage("");

    // Check if the addressId is valid
    if (!addressId) {
      setMessage("Invalid addressId");
      return;
    }

    // Send the request to the server
    try {
      // get the JWT from local storage
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/shipping-info/default-address",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ addressId }),
        }
      );

      // If something goes wrong and response is not ok show the user the error message
      if (!response.ok) {
        // If the status code is 429, it means the user has made too many requests
        // Inform the user about the situation
        if (response.status === 429) {
          const responseData = await response.json();
          setMessage(responseData.error);
        }

        throw new Error("Error setting the default address");
      }

      // Get the response data
      const data = await response.json();

      // Display the success message from the server
      setMessage(data.message);

      // If the request is successful, update the addresses in the context
      // Here I create a new list of addresses from the current list of addresses
      const updatedAddresses = addresses.map((address) =>
        // For each address, check if its id matches the addressId that was passed in the function
        address.id === addressId
          ? // If it does, this is the default address mark isDefault as true
            { ...address, isDefault: true }
          : // If it doesn't, this isn't the default address but mark isDefault as false
            { ...address, isDefault: false }
      );
      // updatedAddresses is now a new list where only the new default address is marked as isDefault
      setAddresses(updatedAddresses);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="shipping-info-modal-container">
      <div className="shipping-info-modal-content">
        {isCreateAddressModalOpen && (
          <CreateAddressModal
            setIsCreateAddressModalOpen={setIsCreateAddressModalOpen}
            setAddresses={setAddresses}
          />
        )}
        <div className="shipping-modal-header">
          <h2>Your Addresses</h2>
          <button
            className="billing-info-modal-close"
            onClick={() => setIsShippingInfoModalOpen(false)}
          >
            X
          </button>
        </div>
        <div className="message-wrapper">
          {message && <p className="submit-message message">{message}</p>}
        </div>
        <div className="addresses-container">
          <div
            className="address-tile add-address-tile"
            onClick={() => setIsCreateAddressModalOpen(true)}
          >
            <span>+</span>
            <p>Add Address</p>
          </div>
          {addresses &&
            addresses.map((address, index) => (
              <div className="address-tile" key={index}>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.stateAbbrev} {address.zip}
                </p>
                <p>
                  {address.country === "United States of America"
                    ? address.countryAbbrev
                    : address.country}
                </p>
                <div className="address-button-wrapper">
                  <button className="address-button">Remove</button>
                  {address.isDefault ? (
                    <small className="default-address-tag">
                      Is Default <small className="default-check">✔</small>
                    </small>
                  ) : (
                    <button
                      className="address-button"
                      onClick={() => setDefault(address.id)}
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ShippingInfoModal;
