import { useContext, useEffect, useState } from "react";
import CreateAddressModal from "../Modal-Components/CreateAddressModal";
import { UserContext } from "../User-Components/UserContext";

function Shipping({
  newAddress,
  setNewAddress,
  expandAddresses,
  setExpandAddresses,
  setExpandCards,
  addressSelection,
  setAddressSelection,
}) {
  const { addresses, setAddresses } = useContext(UserContext); // get the user's addresses from context if there are any
  const [isCreateAddressModalOpen, setIsCreateAddressModalOpen] =
    useState(false);

  // This useEffect runs every time the 'addresses' array changes.
  useEffect(() => {
    // Check if 'addresses' exists and if it contains any elements.
    if (addresses && addresses.length > 0) {
      // Search for a default address in the 'addresses' array.
      // 'find' returns the first element that satisfies the provided condition.
      const defaultAddress = addresses.find((address) => address.isDefault);

      // If a default address is found, set it as the 'addressSelection'.
      if (defaultAddress) {
        setAddressSelection(defaultAddress);
      }
    }
  }, [addresses]); // Dependency array: useEffect will re-run if 'addresses' changes.

  // Function to handle selecting an address
  const handleAddressSelection = (addressIndex) => {
    setAddressSelection(addresses[addressIndex]);
  };

  return (
    <div>
      {addressSelection ? (
        <>
          {!expandAddresses ? (
            <div className="checkout-details-container">
              <div>
                <h2 className="checkout-step-counter">1</h2>
              </div>
              <div>
                <h3>Shipping Address</h3>
              </div>
              <div className="checkout-detail-container">
                <p className="detail-choice-name">
                  {addressSelection.firstName} {addressSelection.lastName}
                </p>
                <p className="address-choice-details">
                  {addressSelection.address}, {addressSelection.city},
                  {addressSelection.stateAbbrev} {addressSelection.zip}
                </p>

                <p>
                  {addressSelection.country === "United States of America"
                    ? addressSelection.countryAbbrev
                    : addressSelection.country}
                </p>
              </div>
              <div>
                <button
                  className="change-address-btn"
                  onClick={() => {
                    setExpandCards(false);
                    setExpandAddresses(true);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="detail-selection-container">
              <div className="detail-header-container">
                <h2 className="checkout-step-counter">1</h2>
                <h3>Choose a shipping address</h3>
                <button
                  className="change-address-btn go-back-btn"
                  onClick={() => setExpandAddresses(false)}
                >
                  Close X
                </button>
              </div>
              <div>
                <h4 className="checkout-step-counter">Your addresses:</h4>
              </div>
              <div className="detail-choice">
                {addresses.map((address, index) => (
                  <div key={index} className="address-choice-item">
                    <div className="radio-button-container">
                      <input
                        type="radio"
                        id={`address${index}`}
                        name="addressSelection"
                        className="address-radio-btn"
                        checked={addressSelection === address}
                        onChange={() => handleAddressSelection(index)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`address${index}`}
                        className="address-choice-label"
                      >
                        <div className="label-content">
                          <div className="address-choice-name">
                            {address.firstName} {address.lastName}
                          </div>
                          <div className="address-choice-details">
                            {address.address}, {address.city},{" "}
                            {address.stateAbbrev} {address.zip}
                          </div>
                          <div className="address-choice-country">
                            {address.country === "United States of America"
                              ? address.countryAbbrev
                              : address.country}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="add-detail-btn"
                onClick={() => setIsCreateAddressModalOpen(true)}
              >
                <span>+</span> Add new address
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="checkout-details-container ">
            <div>
              <h2 className="checkout-step-counter">1</h2>
            </div>
            <div>
              <h3>Shipping Address</h3>
            </div>
            <div className="checkout-detail-container checkout-details-add-button-container">
              <button
                onClick={() => setIsCreateAddressModalOpen(true)}
                className="checkout-details-add-button"
              >
                Add New Address
              </button>
            </div>
          </div>
        </>
      )}
      {isCreateAddressModalOpen && (
        <div className="animation">
          <CreateAddressModal
            setIsCreateAddressModalOpen={setIsCreateAddressModalOpen}
            setNewAddress={setNewAddress}
            setAddresses={setAddresses}
          />
        </div>
      )}
    </div>
  );
}

export default Shipping;
