import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/borger-logo.png";
import { getLastFourDigits } from "../../helpers/cardHelper";
import "../../styles/Modal-Styles/OrderInfoModal.css";

function OrderInfoModal({ orderInfo, setOrderInfo, setIsOrderInfoModalOpen }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Function to capitalize the first letter of a word
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Toggle between showing and hiding detailed info for an order card
  const toggleOrderDetails = (index) => {
    if (expandedOrder === index) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(index);
    }
  };

  // Render the list of items for a specific order
  function renderOrderItems(orderItems) {
    return (
      <ul className="orderItem-list">
        {orderItems.map((orderItem, index) => (
          <li key={index} className="orderItem">
            <p>{orderItem.menuItem.name}</p>
            <p>Price: ${orderItem.menuItem.price}</p>
            <p>Quantity: {orderItem.quantity}</p>
          </li>
        ))}
      </ul>
    );
  }

  console.log("Order Info:", orderInfo);

  return (
    <div className="modal-container">
      <div className="order-info-modal-content">
        <div className="order-info-modal-header">
          <h1>Your Orders</h1>
          <button
            className="modal-close"
            onClick={() => setIsOrderInfoModalOpen(false)}
          >
            X
          </button>
        </div>
        <div className="order-info-container">
          <div className="order-info-top-container">
            <h3>Order Information</h3>
            <p>
              Questions or concerns? Visit our{" "}
              <a href="/contact-us" className="order-contact-link">
                Contact Us
              </a>{" "}
              page.{" "}
            </p>
          </div>

          {!orderInfo || orderInfo.length === 0 ? (
            <div className="no-orders">
              <h2>
                It looks like you haven't placed any orders yet. Visit our{" "}
                <Link to="/menu" className="order-contact-link">
                  menu
                </Link>{" "}
                to browse our selection and get started!
              </h2>
              <div className="message-wrapper">
                <img
                  src={logoImg}
                  alt="Dirty Burger Logo"
                  className="no-order-info-logo"
                />
              </div>
            </div>
          ) : (
            <div className="orderGrid">
              {orderInfo.map((order, index) => (
                <div
                  className={`orderCard ${
                    expandedOrder === index ? "expanded" : ""
                  }`}
                  key={index}
                >
                  <h3>Order Number: {order.orderNumber}</h3>
                  <p>Status: {order.status}</p>
                  <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                  <button
                    onClick={() => toggleOrderDetails(index)}
                    className="order-info-btn"
                  >
                    {expandedOrder === index ? "Hide Details" : "Show Details"}
                  </button>
                  {expandedOrder === index && (
                    <div className="expandedDetails">
                      <div className="order-info-detail">
                        <h4> Shipping Method:</h4>
                        <p>
                          {capitalizeFirstLetter(order.shippingMethod)} - $
                          {order.shippingCost}
                        </p>

                        <h4>Ship to:</h4>
                        <p>
                          {order.shippingInfo.address} {order.shippingInfo.city}
                          , {order.shippingInfo.stateAbbrev}{" "}
                          {order.shippingInfo.zip}{" "}
                          {order.shippingInfo.countryAbbrev}
                        </p>

                        <h4>Est. Delivery Date:</h4>
                        <p>{order.estDeliveryDate}</p>

                        <h4>Placed On:</h4>
                        <p>{new Date(order.createdAt).toLocaleString()}</p>

                        <h4>Payment Method:</h4>
                        {order.cardInfo ? (
                          <p>
                            {order.cardInfo.cardType} Ending In{" "}
                            {getLastFourDigits(order.cardInfo.cardNumber)}
                          </p>
                        ) : (
                          <p>loading...</p>
                        )}
                      </div>

                      <div className="order-info-detail">
                        <h4>Items:</h4>
                        {renderOrderItems(order.orderItems)}
                      </div>
                      <div className="img-wrapper">
                        <img
                          src={logoImg}
                          alt="Dirty Burger Logo"
                          className="order-info-logo"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderInfoModal;
