import { useState } from "react";
import "../../styles/Checkout-Styles/CheckoutDetails.css";
import ShippingMethods from "../Checkout-Components/ShippingMethods";
import Billing from "./Billing";
import GuestInfo from "./GuestInfo";
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
  setUser,
}) {
  const [expandCards, setExpandCards] = useState(false);
  const [expandAddresses, setExpandAddresses] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
  });
  const [newAddress, setNewAddress] = useState({
    country: "United States of America",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  return (
    <div className="checkout-details-parent">
      {user || isGuest ? (
        <>
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
            userFirstName={user ? user.firstName : "Guest"}
            userLastName={user ? user.lastName : "Guest"}
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
        </>
      ) : (
        <>
          {/* User is not logged in (Guest) */}
          <GuestInfo
            setIsGuest={setIsGuest}
            guestInfo={guestInfo}
            setGuestInfo={setGuestInfo}
            setUser={setUser}
          />
        </>
      )}
    </div>
  );
}
export default CheckoutDetails;
