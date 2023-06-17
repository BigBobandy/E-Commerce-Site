import { Link } from "react-router-dom";
import logo from "../../assets/borger-logo.png";
import "../styles/Home-Styles/Header.css";

function Header() {
  return (
    <header>
      <img src={logo} className="borger-logo" />
      <nav className="left-nav">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
      </nav>
      <div className="title-container">
        <h1>Dirty Burger</h1>
      </div>
      <nav className="right-nav">
        <Link to="/login">Sign In</Link>
        <Link to="/signup">Sign Up Now!</Link>
      </nav>
      <img src={logo} className="borger-logo" />
    </header>
  );
}

export default Header;
