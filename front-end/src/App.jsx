import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Home-Components/Footer";
import Header from "./components/Home-Components/Header";
import HomePage from "./components/Home-Components/HomePage";
import LoginModal from "./components/Modal-Components/LoginModal";
import SignUpModal from "./components/Modal-Components/SignUpModal";
import Checkout from "./components/Page-Components/Checkout";
import Menu from "./components/Page-Components/Menu";
import PageMetadata from "./components/Page-Components/PageMetaData";
import UserProfile from "./components/Page-Components/UserProfile";
import { UserProvider } from "./components/User-Components/UserContext";
import { useCart } from "./hooks/useCart";
import { useEmailResend } from "./hooks/useEmailResend";
import { useMenuItems } from "./hooks/useMenuItems";
import "./styles/Modal-Styles/Modal-Global.css";

function App() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { cart, addToCart, removeFromCart, clearCart, totalCost, totalItems } =
    useCart();
  const { handleResendEmail } = useEmailResend();
  const menuItems = useMenuItems();

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
          <div className="animation">
            <LoginModal
              setIsLoginModalOpen={setIsLoginModalOpen}
              handleResendEmail={handleResendEmail}
            />
          </div>
        )}
        {isSignupModalOpen && (
          <div className="animation">
            <SignUpModal
              setIsSignupModalOpen={setIsSignupModalOpen}
              setIsLoginModalOpen={setIsLoginModalOpen}
              handleResendEmail={handleResendEmail}
            />
          </div>
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
          <Route
            path="/menu"
            element={<Menu addToCart={addToCart} menuItems={menuItems} />}
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                menuItems={menuItems}
                cart={cart}
                clearCart={clearCart}
                removeFromCart={removeFromCart}
                addToCart={addToCart}
                totalCost={totalCost}
                totalItems={totalItems}
              />
            }
          />
          <Route path="/profile/:userUrlString" element={<UserProfile />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
