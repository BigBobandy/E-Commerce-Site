import { useState } from "react";
import logoImg from "../../assets/borger-logo.png";
import { getLastFourDigits } from "../../helpers/cardHelper";
import "../../styles/Checkout-Styles/OrderConfirmation.css";

function OrderConfirmation({ orderDetails }) {
  console.log("OrderConfirmation:", orderDetails);
  console.log("Order num", orderDetails.orderNumber);

  // Function to capitalize the first letter of a word
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="checkout-details-parent">
      <div className="order-confirmation-container">
        <div className="order-header">
          <div className="img-wrapper">
            <img
              src={logoImg}
              alt="Dirty Burger Logo"
              className="order-page-logo"
            />
          </div>
          <h2>Thank you for your order!</h2>
          <p>
            We've sent an email confirmation to you with all the order details.
          </p>
          <p>You can also view your orders from your profile.</p>
          <p>
            If you have any questions or concerns, please visit our{" "}
            <a href="/contact-us">Contact Us</a> page.
          </p>
        </div>
        <div className="order-details">
          <div className="div-group-left">
            <div className="order-confirmation-detail">
              <h4>Order Number: </h4>
              <p>{orderDetails.orderNumber}</p>
            </div>
            <div className="order-confirmation-detail">
              <h4>Order total:</h4>
              <p>${orderDetails.totalPrice.toFixed(2)}</p>
            </div>
            <div className="order-confirmation-detail order-items">
              <h4>Items Ordered:</h4>
              <ul>
                {orderDetails.orderItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="div-group-right">
            <div className="order-confirmation-detail">
              <h4>Shipping Address:</h4>
              <p>
                {orderDetails.shippingInfo.address}{" "}
                {orderDetails.shippingInfo.city},{" "}
                {orderDetails.shippingInfo.stateAbbrev}{" "}
                {orderDetails.shippingInfo.zip}{" "}
                {orderDetails.shippingInfo.countryAbbrev}
              </p>
            </div>
            <div className="order-confirmation-detail">
              <h4>Payment Method:</h4>
              <p>
                {orderDetails.cardInfo.cardType} Ending In{" "}
                {getLastFourDigits(orderDetails.cardInfo.cardNumber)}
              </p>
            </div>

            <div className="order-confirmation-detail">
              <h4>Shipping Method:</h4>
              <p>
                {capitalizeFirstLetter(orderDetails.shippingMethod)} - $
                {orderDetails.shippingCost}
              </p>
            </div>
            <div className="order-confirmation-detail">
              <h3>Expected Delivery: </h3>
              <p>{orderDetails.deliveryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
