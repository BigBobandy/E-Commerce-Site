import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Home-Components/Footer";
import Header from "./components/Home-Components/Header";
import HomePage from "./components/Home-Components/HomePage";
import Checkout from "./components/Page-Components/Checkout";
import Menu from "./components/Page-Components/Menu";
import PageMetadata from "./components/Page-Components/PageMetaData";
import UserProfile from "./components/Page-Components/UserProfile";
import LoginModal from "./components/User-Components/LoginModal";
import SignUpModal from "./components/User-Components/SignUpModal";
import { UserProvider } from "./components/User-Components/UserContext";

function App() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize cart state from localStorage if it's available there
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    } else {
      return [];
    }
  });

  // Update localStorage whenever the cart state changes
  useEffect(() => {
    // Stringify and store cart in localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function to add an item to the cart array
  const addToCart = (itemToAdd) => {
    // Check if the item is already in the cart
    const existingCartItem = cart.find((item) => item.id === itemToAdd.id);

    if (existingCartItem) {
      // If the item is already in the cart, map through the cart
      // and return a new array with matching item's quantity incremented.
      setCart(
        cart.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If the item isn't in the cart yet, add it with a quantity of 1.
      setCart([...cart, { ...itemToAdd, quantity: 1 }]);
    }
  };

  // Function for removing an item from the cart's state
  const removeFromCart = (idToRemove) => {
    // Find the item in the cart that matches the ID of the item to remove.
    const itemToRemove = cart.find((item) => item.id === idToRemove);

    // If the quantity of the item to remove is greater than 1...
    if (itemToRemove.quantity > 1) {
      // Use the setCart function to update the cart. Do this by mapping through
      // every item in the cart. If the item's ID matches the ID of the item to
      // remove, create a new object that is a copy of the item, but with its
      // quantity reduced by 1. If the item's ID does not match, we return the item
      // as is.
      setCart(
        cart.map((item) =>
          item.id === idToRemove
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      // If the quantity of the item to remove is 1 (or less), then the item needs
      // to be completely removed from the cart. Start by finding the index
      // of the item to remove.
      const indexToRemove = cart.findIndex((item) => item.id === idToRemove);

      // If the item was found in the cart...
      if (indexToRemove !== -1) {
        // Use the setCart function to update the cart. Create a new
        // array that includes all items in the cart except the one to remove.
        // Use the spread operator (...) to create copies of slices of the
        // original cart array: one slice before the item to remove, and one slice
        // after the item to remove.
        setCart([
          ...cart.slice(0, indexToRemove),
          ...cart.slice(indexToRemove + 1),
        ]);
      }
    }
  };

  // Function to remove all items from the cart and set it back to default
  const clearCart = () => {
    // The clearCart function is much simpler: it uses the setCart function to
    // replace the current cart with an empty array, effectively removing all
    // items from the cart.
    setCart([]);
  };

  // Function to handle re-sending the confirmation email if the user hasn't confirmed it after a certain time
  async function handleResendEmail(email) {
    try {
      // Send the email the user entered earlier to the server
      const response = await fetch(
        "http://localhost:3000/api/signup/resend-confirmation-email",
        {
          method: "POST", // Type of request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Check if the server's response is ok (status in the range 200-299)
      return response.ok;
    } catch (error) {
      // Log the error if an error occurs while sending the request
      console.error("Error during the request:", error);
      return false;
    }
  }

  return (
    <UserProvider>
      <Router>
        <PageMetadata />
        <Header
          cart={cart}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
        />
        {isLoginModalOpen && (
          <LoginModal
            setIsLoginModalOpen={setIsLoginModalOpen}
            handleResendEmail={handleResendEmail}
          />
        )}
        {isSignupModalOpen && (
          <SignUpModal
            setIsSignupModalOpen={setIsSignupModalOpen}
            setIsLoginModalOpen={setIsLoginModalOpen}
            handleResendEmail={handleResendEmail}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setIsLoginModalOpen={setIsLoginModalOpen}
                setIsSignupModalOpen={setIsSignupModalOpen}
              />
            }
          />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} clearCart={clearCart} />}
          />
          <Route path="/profile/:userUrlString" element={<UserProfile />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
