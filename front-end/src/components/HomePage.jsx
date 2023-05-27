import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to the home page bud!</h1>
      <Link to="/signup">Sign Up Now!</Link>
    </div>
  );
}

export default HomePage;
