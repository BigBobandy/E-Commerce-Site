import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/borger-logo.png";
import { UserContext } from "../User-Components/UserContext";
import "../styles/Home-Styles/HomePage.css";
import employeeImg from "/employee-otm.jpg";

function HomePage({ setIsLoginModalOpen, setIsSignupModalOpen }) {
  const { user } = useContext(UserContext); // get the user from the context
  let navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-container">
        <div className="hero-content">
          <h1 className="title-text">Welcome to Dirty Burger!</h1>
          <div className="hero-text">
            <p>
              Have you ever wanted a burger but you were too lazy to go to your
              local fast food joint? Have you ever wished you had ordered a
              burger 1-3 business days ago that could be delivered by mail man
              to your doorstep in your time of need? Here at Dirty Burger your
              days of worrying are over. Place your order today and your future
              self will thank you!
            </p>
            <button onClick={() => navigate("/menu")} className="hero-button">
              Order Now!
            </button>
            {user ? (
              /* If user is logged in */
              <>
                <h2>Welcome back, {user.name}</h2>
                <p>
                  As a member, enjoy discounts at checkout and free shipping on
                  all orders over $100.
                </p>
                <h4>Thank you for being a part of our community!</h4>
              </>
            ) : (
              /* If user is not logged in */
              <>
                <h2>Become a member today</h2>
                <p>
                  Our members enjoy discounts at checkout and free shipping on
                  all orders over $100.
                </p>
                <button
                  onClick={() => setIsSignupModalOpen(true)}
                  className="hero-button"
                >
                  Sign Up!
                </button>
                <p>
                  Already have an account?
                  <a
                    className="sign-in-link"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    {" "}
                    Sign In
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
        <div className="hero-right-side">
          <div className="img-wrapper">
            <img src={logoImg} alt="Dirty Burger Logo" className="logo-img" />
          </div>
        </div>
      </section>
      <section className="about-us-container">
        <div className="about-us-content">
          <div className="about-left-side">
            <h2>What is Dirty Burger?</h2>
            <p>
              We've got the greasiest, dirtiest burgers you'll ever shove into
              your gut. You'll be a cheeseburger walrus in no time! Order today
              and we can get your order from out kitchen to your doorstep in
              only a matter of days maybe weeks. Whether it's cold outside or
              scorching we will ship your favorite burgers, fries and shakes
              right to your doorstep. Just pay shipping and handling!
            </p>
            <small className="disclaimer-text">
              Disclaimer: The delivery trucks are not refrigerated. If
              temperatures exceed 40°F your food may not be safe for
              consumption. Eating spoiled fast food can cause food poisoning
              with symptoms such as upset stomach, diarrhea and vomiting. There
              is also a risk of botulism. Please consume at your own risk!
            </small>
            <h3>
              We offer only the best product for our customers at Dirty Burger!
              Your satisfaction is guaranteed!
            </h3>
            <small className="disclaimer-text">
              Disclaimer: Your satisfaction is only guaranteed when delivery
              time is estimated to be less than 10 - 12 hours and temperatures
              outside are below 40°F.
            </small>
          </div>
        </div>
        <div className="about-right-side">
          <h2>Employee of the Month</h2>
          <h3>
            {new Date().toLocaleString("default", { month: "long" })}{" "}
            {new Date().getFullYear()}
          </h3>
          <img
            src={employeeImg}
            alt="Employee of the Month"
            className="employee-img"
          />
          <h4>Philadelphia Collins</h4>
          <p>
            Phil has been at Dirty Burger from the start and he delivers the
            dirtiest burgers with a smile and a BAAAAAM! Just don't look at his
            gut.
          </p>
        </div>
      </section>
      <div className="benefits">
        <h2>What Dirty Burger Can Do For You</h2>
        <div className="benefits-text">
          <div className="benefit">
            <h3>Free Shipping & Handling</h3>
            <p>We offer free shipping & handling for all orders over $100 </p>
            {!user && (
              <>
                <small className="disclaimer-text">
                  Disclaimer: For members only.{" "}
                </small>

                <small>Sign up today for free shipping & handling!</small>
              </>
            )}
          </div>
          <div className="benefit">
            <h3>24/7 Service</h3>
            <p>
              Think you'll crave a late night snack 1-3 business days from now?
              We process orders as fast as possible 24/7 for your convenience.
            </p>
          </div>
          <div className="benefit">
            <h3>Unique Menu</h3>
            <p>
              Our menu offers a wide range of unique options you can't find
              anywhere else. With service that is unmatched in the industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
