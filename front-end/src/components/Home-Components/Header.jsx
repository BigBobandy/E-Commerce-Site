import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/borger-logo.png";
import { UserContext } from "../User-Components/UserContext";
import UserProfile from "../User-Components/UserProfile";
import "../styles/Home-Styles/Header.css";

function Header({
  cart,
  removeFromCart,
  addToCart,
  setIsLoginModalOpen,
  setIsSignupModalOpen,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useContext(UserContext); // get the user and logout function from the context

  console.log(user);

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

  // Compute the total cost of the items in the cart
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="Dirty burger logo" className="logo-image" />
      </div>
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        {!user && (
          /* If user is not logged in */
          <>
            <a onClick={() => setIsLoginModalOpen(true)}>Sign In</a>
            <a onClick={() => setIsSignupModalOpen(true)}>Sign Up</a>
          </>
        )}
        <button onClick={handleCartClick} className="cart-button">
          Cart <FontAwesomeIcon icon={faShoppingCart} />({totalItems})
        </button>
      </nav>
      {user && (
        /* If user is logged in */
        <div className="user-info">
          <p>Welcome, {user.name}</p>
          <Link to="user-profile"></Link>
          <button className="logout-button-header" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {isCartOpen && (
        <div
          className="cart-modal"
          onClick={(e) => e.target === e.currentTarget && setIsCartOpen(false)}
        >
          <div className="cart-modal-content">
            <h2>
              Your Cart <FontAwesomeIcon icon={faShoppingCart} />({totalItems})
            </h2>
            <button className="close-button" onClick={handleCartClick}>
              X
            </button>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.description}
                  className="cart-image"
                />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => addToCart(item)}>+</button>
                  <p>{item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                </div>
              </div>
            ))}
            <div className="cart-bottom">
              <h3>Subtotal: ${totalCost.toFixed(2)}</h3>
              {totalItems > 0 ? (
                <Link
                  to="/checkout"
                  className="checkout-button"
                  onClick={handleCartClick}
                >
                  CONTINUE TO CHECKOUT
                </Link>
              ) : (
                <Link
                  to="/menu"
                  className="checkout-button"
                  onClick={handleCartClick}
                >
                  GO TO MENU
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
