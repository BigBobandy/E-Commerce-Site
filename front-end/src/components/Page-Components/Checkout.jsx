import { useState } from "react";
import "../../styles/Page-Styles/Checkout.css";
import Billing from "../Checkout-Components/Billing";
import ItemRecommend from "../Checkout-Components/ItemRecommend";
import OrderReview from "../Checkout-Components/OrderReview";
import Shipping from "../Checkout-Components/Shipping";
import ShoppingCart from "../Checkout-Components/ShoppingCart";

function Checkout({
  cart = [],
  addToCart,
  removeFromCart,
  menuItems,
  totalCost,
  totalItems,
}) {
  const [currentStage, setCurrentStage] = useState("Shopping Cart");

  const stages = {
    CART: "Shopping Cart",
    SHIPPING: "Shipping",
    BILLING: "Billing",
    REVIEW: "Order Review",
  };

  const getBreadcrumbs = (currentStage) => {
    const stagesArray = Object.values(stages);
    const currentIndex = stagesArray.indexOf(currentStage);
    return stagesArray.slice(0, currentIndex + 1);
  };

  // `getNextStage` function is used to determine the name of the next stage
  // in the checkout process based on the current stage.
  const getNextStage = (currentStage) => {
    // A switch statement is used to handle different cases for the value of `currentStage`.
    switch (currentStage) {
      // If the current stage is "Shopping Cart", the next stage is "Shipping".
      case stages.CART:
        return stages.SHIPPING;

      // If the current stage is "Shipping", the next stage is "Billing".
      case stages.SHIPPING:
        return stages.BILLING;

      // If the current stage is "Billing", the next stage is "Order Review".
      case stages.BILLING:
        return stages.REVIEW;

      // If the current stage is "Order Review", there is no next stage,
      // so we return "Submit Order". You can change this string to suit your application.
      case stages.REVIEW:
        return "Submit Order"; // you can change this to anything you want

      // If the `currentStage` doesn't match any of the predefined stages
      // (for instance, if there's a bug in the code elsewhere), we return "Shopping Cart"
      // as the default value. This way, the user will be taken back to the first step of the process.
      default:
        return "Shopping Cart";
    }
  };
  // handle stage transition
  const goToNextStage = () => {
    switch (currentStage) {
      case stages.CART:
        setCurrentStage(stages.SHIPPING);
        break;
      case stages.SHIPPING:
        setCurrentStage(stages.BILLING);
        break;
      case stages.BILLING:
        setCurrentStage(stages.REVIEW);
        break;
      default:
        break;
    }
  };

  // handle back stage
  const goToPreviousStage = () => {
    switch (currentStage) {
      case stages.SHIPPING:
        setCurrentStage(stages.CART);
        break;
      case stages.BILLING:
        setCurrentStage(stages.SHIPPING);
        break;
      case stages.REVIEW:
        setCurrentStage(stages.BILLING);
        break;
      default:
        break;
    }
  };

  return (
    <div className="checkout-container">
      <div className="message-wrapper">
        <h1>Checkout </h1>
      </div>
      <div className="breadcrumb-container">
        {getBreadcrumbs(currentStage).map((stage, index) => (
          <span key={index}>
            {index > 0 && " > "}
            <a
              href="#"
              className="breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStage(stage);
              }}
            >
              {stage}
            </a>
          </span>
        ))}
      </div>
      <div className="checkout-content-container">
        {currentStage === stages.CART && (
          <ShoppingCart
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            menuItems={menuItems}
          />
        )}
        <div className="checkout-summary"></div>
        {currentStage === stages.SHIPPING && (
          <Shipping
            goToNextStage={goToNextStage}
            goToPreviousStage={goToPreviousStage}
          />
        )}
        {currentStage === stages.BILLING && (
          <Billing
            goToNextStage={goToNextStage}
            goToPreviousStage={goToPreviousStage}
          />
        )}
        {currentStage === stages.REVIEW && (
          <OrderReview
            goToNextStage={goToNextStage}
            goToPreviousStage={goToPreviousStage}
          />
        )}
        <div className="checkout-left-side-container">
          <div className="order-summary-container">
            <div className="message-wrapper">
              <h3 className="checkout-container-title">
                Subtotal ({totalItems} items):
              </h3>
              <h3 className="order-total">${totalCost.toFixed(2)}</h3>
            </div>
            <div className="message-wrapper">
              <button onClick={goToNextStage} className="checkout-button">
                Proceed to {getNextStage(currentStage)}
              </button>
            </div>
          </div>
          {currentStage === stages.CART && (
            <>
              <ItemRecommend
                cart={cart}
                addToCart={addToCart}
                menuItems={menuItems}
                currentStage={currentStage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
