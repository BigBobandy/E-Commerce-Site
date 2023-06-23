import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/borger-logo.png";
import "../styles/Home-Styles/HomePage.css";

function HomePage() {
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
            <h2>Become a member today</h2>
            <p>
              Our members enjoy discounts at checkout and free shipping on all
              orders over $100.
            </p>
            <button onClick={() => navigate("/menu")} className="hero-button">
              Sign Up!
            </button>
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
          <img src={logoImg} alt="Dirty Burger Logo" className="logo-img" />
        </div>
      </section>
      <div className="benefits">
        <h2>What Dirty Burger Can Do For You</h2>
        <div className="benefits-text">
          <div className="benefit">
            <h3>Free Delivery</h3>
            <p>
              We offer free delivery for all orders over $100{" "}
              <small className="disclaimer-text">
                Disclaimer: For members only. Sign up today for free shipping!
              </small>
            </p>
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
