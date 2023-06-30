import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Home-Components/Footer";
import Header from "./components/Home-Components/Header";
import HomePage from "./components/Home-Components/HomePage";
import Checkout from "./components/Page-Components/Checkout";
import Menu from "./components/Page-Components/Menu";
import ConfirmEmail from "./components/User-Components/ConfirmEmail";
import LoginModal from "./components/User-Components/LoginModal";
import SignUpModal from "./components/User-Components/SignUpModal";
import { UserProvider } from "./components/User-Components/UserContext";
import UserProfile from "./components/User-Components/UserProfile";

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

  const removeFromCart = (idToRemove) => {
    const itemToRemove = cart.find((item) => item.id === idToRemove);

    if (itemToRemove.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === idToRemove
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      const indexToRemove = cart.findIndex((item) => item.id === idToRemove);

      if (indexToRemove !== -1) {
        setCart([
          ...cart.slice(0, indexToRemove),
          ...cart.slice(indexToRemove + 1),
        ]);
      }
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <UserProvider>
      <Router>
        <Header
          cart={cart}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
        />
        {isLoginModalOpen && (
          <LoginModal setIsLoginModalOpen={setIsLoginModalOpen} />
        )}
        {isSignupModalOpen && (
          <SignUpModal
            setIsSignupModalOpen={setIsSignupModalOpen}
            setIsLoginModalOpen={setIsLoginModalOpen}
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
          <Route path="/confirm/:codeParam" element={<ConfirmEmail />} />
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
