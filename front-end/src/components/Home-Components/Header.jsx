import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/borger-logo.png";
import "../styles/Home-Styles/Header.css";

function Header({ cart }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Function that calculates how many items are in the cart
  const totalItems = cart.reduce((total, item) => {
    // `total` is the accumulator that keeps track of the total quantity of items in the cart.
    // On the first call, it is initialized to `0`.

    // `item` is the current item being processed in the cart array.

    // For each item in the cart, add its quantity to the total.
    return total + item.quantity;

    // start with an initial total of `0`.
  }, 0);

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="Dirty burger logo" className="logo-image" />
      </div>
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <div className="cart-button-container">
        <button onClick={handleCartClick} className="cart-button">
          Cart <FontAwesomeIcon icon={faShoppingCart} />({totalItems})
        </button>
      </div>
      {isCartOpen && (
        <div
          className="cart-modal"
          onClick={(e) => e.target === e.currentTarget && setIsCartOpen(false)}
        >
          <div className="cart-modal-content">
            <h2>Items In Cart:</h2>
            <button className="close-button" onClick={handleCartClick}>
              X
            </button>
            {cart.map((item) => (
              <div key={item.id}>
                <p>
                  {item.name} x {item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
