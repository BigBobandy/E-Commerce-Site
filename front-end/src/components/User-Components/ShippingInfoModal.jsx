import { useContext, useState } from "react";
import "../../styles/User-Styles/ShippingInfoModal.css";
import CreateAddressModal from "./CreateAddressModal";
import { UserContext } from "./UserContext";

function ShippingInfoModal({ setIsShippingInfoModalOpen }) {
  const [isCreateAddressModalOpen, setIsCreateAddressModalOpen] =
    useState(false);
  const { addresses, setAddresses } = useContext(UserContext); // Get the user's address information from context

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
                <p>{address.country}</p>
                <div className="address-button-wrapper">
                  <button className="address-button">Remove</button>
                  <button className="address-button">Set Default</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ShippingInfoModal;
