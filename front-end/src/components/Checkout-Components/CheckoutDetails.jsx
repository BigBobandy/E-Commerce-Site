import { useState } from "react";
import "../../styles/Checkout-Styles/CheckoutDetails.css";
import ShippingMethods from "../Checkout-Components/ShippingMethods";

import Billing from "./Billing";
import Shipping from "./Shipping";

function CheckoutDetails({
  totalCost,
  setShippingCost,
  cardSelection,
  setCardSelection,
  addressSelection,
  setAddressSelection,
  shippingMethod,
  setShippingMethod,
  user,
}) {
  const [message, setMessage] = useState("");
  const [expandCards, setExpandCards] = useState(false);
  const [expandAddresses, setExpandAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({
    country: "United States of America",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  return (
    <div className="checkout-details-parent">
      <div className="message-wrapper">
        {message && <p className="submit-message message">{message}</p>}
      </div>
      <Shipping
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        addressSelection={addressSelection}
        setAddressSelection={setAddressSelection}
        expandAddresses={expandAddresses}
        setExpandAddresses={setExpandAddresses}
        setExpandCards={setExpandCards}
      />
      <Billing
        userFirstName={user.firstName}
        userLastName={user.lastName}
        expandCards={expandCards}
        cardSelection={cardSelection}
        setCardSelection={setCardSelection}
        setExpandCards={setExpandCards}
        setExpandAddresses={setExpandAddresses}
      />
      <ShippingMethods
        totalCost={totalCost}
        setShippingCost={setShippingCost}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />
    </div>
  );
}

export default CheckoutDetails;
