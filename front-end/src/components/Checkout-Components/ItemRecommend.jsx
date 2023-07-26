import { useEffect, useState } from "react";
import "../../styles/Checkout-Styles/ItemRecommend.css";

function ItemRecommend({ cart = [], addToCart, menuItems }) {
  const [recommendedItems, setRecommendedItems] = useState([]);

  // Standalone function to generate recommended items
  const generateRecommendedItems = () => {
    let recommended = [...recommendedItems]; // Make a copy of current recommendedItems

    // Flatten all items into one array
    const allItems = Object.values(menuItems).flat();

    // Filter out any items that are already in the cart
    const itemsNotInCart = allItems.filter(
      (item) => !cart.find((cartItem) => cartItem.id === item.id)
    );

    // If there are any items not in the cart
    while (recommended.length < 2 && itemsNotInCart.length > 0) {
      // Pick one at random and add it to the recommended items
      const randomIndex = Math.floor(Math.random() * itemsNotInCart.length);
      recommended.push(itemsNotInCart[randomIndex]);

      // Remove the recommended item from the array of items not in cart
      itemsNotInCart.splice(randomIndex, 1);
    }

    // Remove any recommended items that are now in the cart
    recommended = recommended.filter(
      (item) => !cart.find((cartItem) => cartItem.id === item.id)
    );

    // Return the recommended items
    return recommended;
  };

  // useEffect hook for generating the initial recommended items
  useEffect(() => {
    const recommended = generateRecommendedItems();

    // Store the recommended items in state
    setRecommendedItems(recommended);
  }, []); // Run this useEffect when the component mounts

  // useEffect triggers on 'cart' prop changes
  useEffect(() => {
    // setRecommendedItems uses functional update form,
    // allowing new state to depend on the previous state
    setRecommendedItems((currentRecommendedItems) => {
      // Filter 'currentRecommendedItems' to exclude items present in 'cart'
      const updatedRecommendedItems = currentRecommendedItems.filter(
        (item) => !cart.find((cartItem) => cartItem.id === item.id)
      );

      // Return updated list of recommended items
      return updatedRecommendedItems;
    });
  }, [cart]); // Depend on 'cart' changes
  return (
    <>
      {recommendedItems.length > 0 && (
        <div className="checkout-left-side-container">
          <div className="recommended-items-container">
            <div className="message-wrapper">
              <h3 className="checkout-container-title">You should also try</h3>
            </div>
            {recommendedItems.map((item) => (
              <div className="recommended-item" key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-image recommended-image"
                />
                <div className="recommended-item-details">
                  <h3 className="checkout-container-title">{item.name}</h3>
                  <div className="detail-row">
                    <p className="recommended-item-price">${item.price}</p>{" "}
                    <button
                      className="checkout-button recommended-button"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ItemRecommend;
