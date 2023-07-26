import "../../styles/Checkout-Styles/ShoppingCart.css";

function ShoppingCart({ cart = [], addToCart, removeFromCart }) {
  return (
    <div className="checkout-cart-container">
      <div className="message-wrapper">
        <h2 className="checkout-container-title">Your Shopping Cart</h2>
      </div>
      {cart.map((item) => (
        <div key={item.id} className="checkout-cart-item">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="checkout-cart-image"
          />
          <div className="item-details-left-container">
            <div className="item-details-column">
              <h3 className="checkout-container-title">{item.name}</h3>
            </div>
          </div>
          <div className="item-details-right-container">
            <div className="item-details-row">
              <h3 className="item-price">${item.price}</h3>
              <div className="quantity-control">
                <button onClick={() => addToCart(item)}>+</button>
                <p>{item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)}>-</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShoppingCart;
