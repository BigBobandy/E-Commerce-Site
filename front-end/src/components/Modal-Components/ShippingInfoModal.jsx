import { useContext, useEffect, useState } from "react";
import "../../styles/Modal-Styles/ShippingInfoModal.css";
import { UserContext } from "../User-Components/UserContext";
import CreateAddressModal from "./CreateAddressModal";

function ShippingInfoModal({ setIsShippingInfoModalOpen }) {
  const [isCreateAddressModalOpen, setIsCreateAddressModalOpen] =
    useState(false);
  const { addresses, setAddresses } = useContext(UserContext); // Get the user's address information from context
  const [message, setMessage] = useState("");

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
          return;
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
          ? // If it does, this is the default new address so mark isDefault as true
            { ...address, isDefault: true }
          : // If it doesn't, this isn't the default address so mark isDefault as false
            { ...address, isDefault: false }
      );
      // updatedAddresses is now a new list where only the new default address is marked as isDefault
      setAddresses(updatedAddresses);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Function to handle deleting a user's address
  async function deleteAddress(addressId) {
    // Clear any previous messages
    setMessage("");

    // Check if the addressId is valid
    if (!addressId) {
      setMessage("Invalid addressId");
      return;
    }

    // If this is the last address, confirm with the user
    if (addresses.length === 1) {
      const confirmation = window.confirm(
        "Are you sure you want to delete your last address?"
      );
      if (!confirmation) {
        return;
      }
    }

    // Send the request to the server
    try {
      // Get the JWT from local storage
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/shipping-info/delete-address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If something goes wrong and response is not ok show the user the error message
      if (!response.ok) {
        // Handle different error status codes
        const responseData = await response.json();
        // Set the message state to the error returned by the API
        setMessage(responseData.error);

        // Throw an error to stop the execution and trigger the catch block
        throw new Error("Error deleting the address");
      } else {
        // If response is OK, then parse the JSON data from the response
        const responseData = await response.json();

        // If the request is successful, remove the deleted address from the context
        let updatedAddresses = addresses.filter(
          (address) => address.id !== addressId
        );

        // If the response includes a new default address, update the default address in the state
        if (responseData.defaultAddress) {
          // Find the new default address in the updatedAddresses array and set isDefault to true
          updatedAddresses = updatedAddresses.map((address) =>
            address.id === responseData.defaultAddress.id
              ? { ...address, isDefault: true }
              : address
          );
        }

        // Update the addresses in the context
        setAddresses(updatedAddresses);
        // Set the message state to a successful message
        setMessage("Address deleted successfully.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="modal-container">
      <div className="shipping-info-modal-content">
        {isCreateAddressModalOpen && (
          <div className="animation">
            <CreateAddressModal
              setIsCreateAddressModalOpen={setIsCreateAddressModalOpen}
              setAddresses={setAddresses}
            />
          </div>
        )}
        <div className="shipping-modal-header">
          <h2>Your Addresses</h2>
          <button
            className="modal-close"
            onClick={() => setIsShippingInfoModalOpen(false)}
          >
            Close X
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
            addresses.map((address) => (
              <div className="address-tile" key={address.id}>
                <p>
                  {address.firstName} {address.lastName}
                </p>
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
                  <button
                    className="address-button"
                    onClick={() => deleteAddress(address.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ShippingInfoModal;
