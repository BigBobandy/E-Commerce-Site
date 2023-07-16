import { useState } from "react";
import "../../styles/Page-Styles/Checkout.css";

function Checkout({ cart = [], clearCart }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  // This function will be called whenever the form fields change
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Compute the total cost of the items in the cart
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* List of items in the cart */}
      {cart.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>
            ${item.price} x {item.quantity}
          </p>
        </div>
      ))}

      {/* Checkout form */}
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Card Number:
          <input
            type="text"
            name="cardNumber"
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Expiration Date:
          <input
            type="text"
            name="expirationDate"
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          CVV:
          <input type="text" name="cvv" onChange={handleInputChange} required />
        </label>

        <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
