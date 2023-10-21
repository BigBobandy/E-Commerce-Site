import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/borger-logo.png";
import "../../styles/Home-Styles/Header.css";
import "../../styles/Page-Styles/MediaQueries.css";
import GuestModal from "../Modal-Components/GuestModal";
import { UserContext } from "../User-Components/UserContext";

function Header({
  cart,
  removeFromCart,
  addToCart,
  setIsLoginModalOpen,
  setIsSignupModalOpen,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useContext(UserContext); // get the user from the context
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

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
      {isGuestModalOpen && (
        <GuestModal setIsGuestModalOpen={setIsGuestModalOpen} />
      )}
      <div className="logo-container">
        <img src={logo} alt="Dirty burger logo" className="logo-image" />
      </div>
      <nav className={`nav-bar ${user ? "grid-nav-4" : "grid-nav-5"}`}>
        <Link className="grid-item" to="/">
          Home
        </Link>
        <Link className="grid-item" to="/menu">
          Menu
        </Link>
        {!user && (
          /* If user is not logged in */
          <>
            <a className="grid-item" onClick={() => setIsLoginModalOpen(true)}>
              Sign In
            </a>
            <a className="grid-item" onClick={() => setIsSignupModalOpen(true)}>
              Sign Up
            </a>
          </>
        )}
        {user && (
          /* If user is logged in */
          <div className="user-info grid-item">
            <Link to={`/profile/${user.userUrlString}`}>
              Profile <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
        )}
        <a className="grid-item cart-button" onClick={handleCartClick}>
          Cart <FontAwesomeIcon icon={faShoppingCart} /> ({totalItems})
        </a>
      </nav>
      {isCartOpen && (
        <div
          className="cart-modal animation"
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
                user ? (
                  <Link
                    to="/checkout"
                    className="checkout-button"
                    onClick={handleCartClick}
                  >
                    CONTINUE TO CHECKOUT
                  </Link>
                ) : (
                  <button
                    className="checkout-button"
                    onClick={() => {
                      setIsGuestModalOpen(true);
                      setIsCartOpen(false);
                    }}
                  >
                    CONTINUE TO CHECKOUT
                  </button>
                )
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
