import { useContext } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { UserContext } from "../User-Components/UserContext";
import favicon from "/favicon.png";

function PageMetadata() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  let title = "Dirty Burger";
  // Check if user is not null before trying to access user.userUrlString
  const userUrlString = user ? user.userUrlString : null;

  // Set title based on current path
  if (location.pathname === "/") {
    title = `${title} - Home`;
  } else if (location.pathname === "/menu") {
    title = `${title} - Menu`;
  } else if (location.pathname === "/checkout") {
    title = `${title} - Checkout`;
  } else if (location.pathname === `/profile/${userUrlString}`) {
    title = `${title} - Profile`;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="icon" type="image/png" href={favicon} />
    </Helmet>
  );
}

export default PageMetadata;
