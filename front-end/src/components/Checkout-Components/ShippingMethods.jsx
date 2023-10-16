import { useContext, useEffect } from "react";
import "../../styles/Checkout-Styles/ShippingMethods.css";
import { UserContext } from "../User-Components/UserContext";

function ShippingMethods({
  totalCost,
  setShippingCost,
  shippingMethod,
  setShippingMethod,
}) {
  const { user } = useContext(UserContext);

  // UseEffect hook for selecting a default shipping method
  useEffect(() => {
    // Initialize the default shipping method
    let defaultMethod = "standard"; // Default to standard shipping
    if (user && totalCost >= 100) {
      defaultMethod = "free"; // If user qualifies for free shipping
    }
    setShippingMethod(defaultMethod);
    setShippingCost(calculateShippingPrice(defaultMethod));
  }, [totalCost, user]);

  // This function handles the change in shipping method selected by the user.
  const handleShippingMethodChange = (e) => {
    // Get the value of the selected shipping method from the radio button.
    const selectedShippingMethod = e.target.value;

    // Update the state to reflect the new selected shipping method.
    setShippingMethod(selectedShippingMethod);

    // Calculate and update the shipping cost based on the selected method.
    setShippingCost(calculateShippingPrice(selectedShippingMethod));

    // Log the current shipping method for debugging purposes.
    console.log(shippingMethod);
  };

  // This function calculates the shipping price based on the selected method.
  const calculateShippingPrice = (method) => {
    // Use a switch statement to determine the shipping cost.
    switch (method) {
      case "standard":
        return 15.99;
      case "express":
        return 22.99;
      case "overnight":
        return 34.99;
      case "free":
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div>
      <div className="shipping-methods-details-container">
        <div className="shipping-methods-header">
          <div>
            <h2 className="checkout-step-counter">3</h2>
          </div>
          <div>
            <h3>Select Shipping Method</h3>
          </div>
        </div>
        <div className="radio-options-container">
          <div className="message-wrapper">
            {user && totalCost < 100 && (
              <p className="shipping-methods-message">
                You're so close to qualifying for free shipping! Our members
                enjoy free shipping on all orders of $100 or more.
              </p>
            )}
            {user && totalCost >= 100 && (
              <p className="shipping-methods-message">
                Your order is $100 or more you qualify for free shipping!
              </p>
            )}
          </div>
          <div className="shipping-method-options-wrapper">
            {user && totalCost >= 100 && (
              <div className="shipping-method-option">
                <input
                  type="radio"
                  id="free"
                  name="shipping"
                  value="free"
                  className="styled-radio-button"
                  checked={shippingMethod === "free"}
                  onChange={handleShippingMethodChange}
                />
                <label htmlFor="free">Member Shipping (7-10 days) - FREE</label>
              </div>
            )}
            <div className="shipping-method-option">
              <input
                type="radio"
                id="standard"
                name="shipping"
                value="standard"
                className="styled-radio-button"
                checked={shippingMethod === "standard"}
                onChange={handleShippingMethodChange}
              />
              <label htmlFor="standard">Standard (5-7 days) - $15.99</label>
            </div>
            <div className="shipping-method-option">
              <input
                type="radio"
                id="express"
                name="shipping"
                value="express"
                className="styled-radio-button"
                checked={shippingMethod === "express"}
                onChange={handleShippingMethodChange}
              />
              <label htmlFor="express">Express (2-3 days) - $22.99</label>
            </div>
            <div className="shipping-method-option">
              <input
                type="radio"
                id="overnight"
                name="shipping"
                value="overnight"
                className="styled-radio-button"
                checked={shippingMethod === "overnight"}
                onChange={handleShippingMethodChange}
              />
              <label htmlFor="overnight">Overnight (1 day) - $34.99</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingMethods;
