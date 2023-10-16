import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../helpers/config";
import "../../styles/Checkout-Styles/OrderSummary.css";
import { UserContext } from "../User-Components/UserContext";

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
  cart,
  setCart,
  isOrderPlaced,
  setIsOrderPlaced,
  setOrderDetailsState,
}) {
  const [taxAmount, setTaxAmount] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setOrderInfo } = useContext(UserContext);

  // Calculate the tax amount based on the total cost
  const calculateTaxAmount = (totalCost) => {
    // Tax rate is 7%
    const taxRate = 0.07;
    return totalCost * taxRate;
  };

  // Function to calculate the expected delivery date
  const getDeliveryDate = (shippingMethod) => {
    const currentDate = new Date();
    let deliveryDays;

    console.log(shippingMethod);

    switch (shippingMethod) {
      case "free":
        deliveryDays = 10;
        break;
      case "standard":
        deliveryDays = 7;
        break;
      case "express":
        deliveryDays = 3;
        break;
      case "overnight":
        deliveryDays = 1;
        break;
      default:
        deliveryDays = 0;
    }

    currentDate.setDate(currentDate.getDate() + deliveryDays);
    return currentDate.toDateString();
  };

  // Update the tax amount and order total when the total cost changes
  useEffect(() => {
    setTaxAmount(calculateTaxAmount(totalCost));
    setOrderTotal(totalCost + shippingCost + calculateTaxAmount(totalCost));
  }, [totalCost, shippingCost]);

  // Handles sending the POST request to create an order
  async function handleSubmitOrder() {
    // Clear any previous messages
    setMessage("");

    // INPUT VALIDATION
    // Validate if a shipping address is selected
    if (!addressSelection || !addressSelection.id) {
      setMessage("Please select a shipping address.");
      setIsLoading(false);
      return;
    }

    // Validate if a billing method is selected
    if (!cardSelection || !cardSelection.id) {
      setMessage("Please select a billing method.");
      setIsLoading(false);
      return;
    }

    // Validate if a shipping method is selected
    if (!shippingMethod) {
      setMessage("Please select a shipping method.");
      setIsLoading(false);
      return;
    }

    // Set loading state to true
    setIsLoading(true);

    // Calculate and set the expected delivery date
    const calculatedDeliveryDate = getDeliveryDate(shippingMethod);

    // Prepare order details object for POST request
    // I just want to send the id of the card and address for the post request as this is sensitive information
    const orderDetailsForPost = {
      orderItems: cart,
      shippingInfoId: addressSelection.id,
      cardInfoId: cardSelection.id,
      totalPrice: orderTotal,
      shippingMethod,
      shippingCost,
      deliveryDate: calculatedDeliveryDate,
    };

    // Prepare order details object for local state
    // Seperate order details object specifically to be used for the order confirmation component
    // It has the full address and card details of the selected card instead of just the ids
    const orderDetailsForState = {
      ...orderDetailsForPost,
      shippingInfo: addressSelection, // Full address details
      cardInfo: cardSelection, // Full card details
    };

    // Update state with full order details
    setOrderDetailsState(orderDetailsForState);

    // Retrieve token from local storage
    const token = localStorage.getItem("token");

    try {
      // Send POST request to submit the order
      const response = await fetch(`${apiUrl}/api/orders/submit-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetailsForPost),
      });

      // Handle unsuccessful responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Handle successful response
      const data = await response.json();

      // Update the orderDetailsState with the order number from the response
      setOrderDetailsState((prevOrderDetails) => ({
        ...prevOrderDetails,
        orderNumber: data.orderNumber,
      }));

      // Inform user order was placed successfully
      setMessage("Order Placed Successfully!");

      // Reset loading state
      setIsLoading(false);

      // Set isOrderPlaced to true to trigger ui change
      setIsOrderPlaced(true);

      // Update orderInfo in context with the new order
      setOrderInfo((prevOrderInfo) => [...prevOrderInfo, data]);

      // Set the cart back to it's default state
      setCart([]);
    } catch (error) {
      // Handle errors during the fetch
      console.error("Failed to submit order:", error);
      setIsLoading(false);
    }
  }

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
            {!isOrderPlaced && (
              <div className="message-wrapper">
                <h4>{message}</h4>
              </div>
            )}
          </>
        )}
      </div>
      <div className="message-wrapper">
        {currentStage === "Shopping Cart" ? (
          <button onClick={goToNextStage} className="checkout-button">
            {getNextStage(currentStage)}
          </button>
        ) : (
          <>
            {isLoading ? (
              <div className="spinner"></div>
            ) : isOrderPlaced ? (
              <h4>Order has been placed successfully.</h4>
            ) : (
              <button onClick={handleSubmitOrder} className="checkout-button">
                Place Order
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderSummary;
