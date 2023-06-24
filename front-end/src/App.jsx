import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Home-Components/Footer";
import Header from "./components/Home-Components/Header";
import HomePage from "./components/Home-Components/HomePage";
import Checkout from "./components/Page-Components/Checkout";
import Menu from "./components/Page-Components/Menu";
import ConfirmEmail from "./components/Signup-Components/ConfirmEmail";
import SignUp from "./components/Signup-Components/SignUp";

function App() {
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
    <Router>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        addToCart={addToCart}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm/:codeParam" element={<ConfirmEmail />} />
        <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} clearCart={clearCart} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
