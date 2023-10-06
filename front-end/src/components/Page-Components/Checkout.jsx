import { useContext, useState } from "react";
import "../../styles/Page-Styles/Checkout.css";
import CheckoutDetails from "../Checkout-Components/CheckoutDetails";
import ItemRecommend from "../Checkout-Components/ItemRecommend";
import OrderConfirmation from "../Checkout-Components/OrderConfirmation";
import OrderSummary from "../Checkout-Components/OrderSummary";
import ShoppingCart from "../Checkout-Components/ShoppingCart";
import { UserContext } from "../User-Components/UserContext";

function Checkout({
  cart = [],
  setCart,
  addToCart,
  removeFromCart,
  menuItems,
  totalCost,
  totalItems,
}) {
  const { user } = useContext(UserContext);
  const [currentStage, setCurrentStage] = useState("Shopping Cart");
  const [shippingCost, setShippingCost] = useState(0);
  const [cardSelection, setCardSelection] = useState(null);
  const [addressSelection, setAddressSelection] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderDetailsState, setOrderDetailsState] = useState({});

  // Object containing key-value pairs for each stage of the checkout process
  const stages = {
    CART: "Shopping Cart",
    SHIPPING_AND_BILLING: "Shipping & Billing",
  };

  // Define a function `getBreadcrumbs` that takes in the `currentStage` as a parameter.
  const getBreadcrumbs = (currentStage) => {
    // Convert the object `stages` to an array `stagesArray`.
    // This makes it easier to find the index of a certain stage, which is not straightforward with objects.
    const stagesArray = Object.values(stages);

    // Find the index of the `currentStage` in the `stagesArray`.
    const currentIndex = stagesArray.indexOf(currentStage);

    // Use the `slice` method to create a new array that includes all the stages from the start of the checkout process
    // up to and including the `currentStage`.
    return stagesArray.slice(0, currentIndex + 1);
  };

  // `getNextStage` function is used to determine the name of the next stage
  // in the checkout process based on the current stage.
  const getNextStage = (currentStage) => {
    // A switch statement is used to handle different cases for the value of `currentStage`.
    switch (currentStage) {
      case stages.CART:
        return stages.SHIPPING_AND_BILLING;
      case stages.SHIPPING_AND_BILLING:
        return "Place Order";
      default:
        return "Shopping Cart";
    }
  };
  // handle stage transition
  const goToNextStage = () => {
    switch (currentStage) {
      case stages.CART:
        setCurrentStage(stages.SHIPPING_AND_BILLING);
        break;
      case stages.SHIPPING_AND_BILLING:
        setCurrentStage("Place Order");
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
      {!isOrderPlaced && (
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
      )}
      <div className="checkout-content-container">
        {currentStage === stages.CART && (
          <ShoppingCart
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        )}
        {currentStage === stages.SHIPPING_AND_BILLING && (
          <>
            {!isOrderPlaced ? (
              <CheckoutDetails
                goToNextStage={goToNextStage}
                getNextStage={getNextStage}
                totalCost={totalCost}
                cardSelection={cardSelection}
                setCardSelection={setCardSelection}
                addressSelection={addressSelection}
                setAddressSelection={setAddressSelection}
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
                setShippingCost={setShippingCost}
                user={user}
              />
            ) : (
              <OrderConfirmation orderDetails={orderDetailsState} />
            )}
          </>
        )}
        {!isOrderPlaced && (
          <div className="checkout-left-side-container">
            <OrderSummary
              totalCost={totalCost}
              shippingCost={shippingCost}
              totalItems={totalItems}
              goToNextStage={goToNextStage}
              getNextStage={getNextStage}
              currentStage={currentStage}
              shippingMethod={shippingMethod}
              cardSelection={cardSelection}
              addressSelection={addressSelection}
              user={user}
              cart={cart}
              setCart={setCart}
              isOrderPlaced={isOrderPlaced}
              setIsOrderPlaced={setIsOrderPlaced}
              setOrderDetailsState={setOrderDetailsState}
            />

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
        )}
      </div>
    </div>
  );
}

export default Checkout;
