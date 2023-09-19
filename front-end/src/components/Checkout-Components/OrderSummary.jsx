import { useEffect, useState } from "react";
import "../../styles/Checkout-Styles/OrderSummary.css";

function OrderSummary({
  totalCost,
  totalItems,
  goToNextStage,
  getNextStage,
  currentStage,
  shippingCost,
  shippingMethod,
  cardSelection,
  addressSelection,
  user,
}) {
  const [taxAmount, setTaxAmount] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);

  console.log(
    "Checkout Details:",
    shippingMethod,
    cardSelection,
    addressSelection
  );

  // Calculate the tax amount based on the total cost
  const calculateTaxAmount = (totalCost) => {
    // Tax rate is 7%
    const taxRate = 0.07;
    return totalCost * taxRate;
  };

  // Update the tax amount and order total when the total cost changes
  useEffect(() => {
    setTaxAmount(calculateTaxAmount(totalCost));
    setOrderTotal(totalCost + shippingCost + calculateTaxAmount(totalCost));
  }, [totalCost, shippingCost]);

  return (
    <div className="order-summary-container">
      <div className="order-summary-total-container">
        <div className="order-total-detail">
          <h3 className="checkout-container-title">
            Subtotal ({totalItems} items):
          </h3>
          <h3 className="order-total">${totalCost.toFixed(2)}</h3>
        </div>
        {currentStage !== "Shopping Cart" && (
          <>
            <div className="order-total-detail">
              <p>Total before tax: </p>
              <p>${totalCost.toFixed(2)}</p>
            </div>
            <div className="order-total-detail">
              <p>Shipping & handling:</p>
              <p>${shippingCost.toFixed(2)}</p>
            </div>
            <div className="order-total-detail">
              <p>Estimated tax:</p>
              <p> ${taxAmount.toFixed(2)}</p>
            </div>
            <div className="order-total-detail">
              <h3 className="total-title">Order total:</h3>
              <h3>${orderTotal.toFixed(2)}</h3>
            </div>
          </>
        )}
      </div>
      <div className="message-wrapper">
        <button onClick={goToNextStage} className="checkout-button">
          {getNextStage(currentStage)}
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
