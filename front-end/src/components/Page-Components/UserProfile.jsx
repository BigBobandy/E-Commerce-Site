import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/borger-logo.png";
import "../../styles/Page-Styles/UserProfile.css";
import BillingInfoModal from "../Modal-Components/BillingInfoModal";
import EditProfileModal from "../Modal-Components/EditProfileModal";
import ShippingInfoModal from "../Modal-Components/ShippingInfoModal";
import { UserContext } from "../User-Components/UserContext";

function UserProfile() {
  const { user, logout } = useContext(UserContext); // get the user and logout function from the context
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isBillingInfoModalOpen, setIsBillingInfoModalOpen] = useState(false);
  const [isShippingInfoModalOpen, setIsShippingInfoModalOpen] = useState(false);

  const navigate = useNavigate();

  // Function for masking the user's email so that it isn't displayed in it's entirety
  const emailMask = (email) => {
    if (!email) {
      return "Loading...";
    }

    const maskedEmail = `${email.substring(0, 3)}*********@${email.substring(
      email.indexOf("@") + 1
    )}`;
    return maskedEmail;
  };

  // Use effect hook that checks if the user's token is valid or expired
  // If the token is expired then the server will send back a 401 response
  // If this is the case then it will navigate the user to the home page
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "http://localhost:3000/api/login/validate-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error(error);
          if (error.message.includes("401")) {
            console.log("navigating home due to 401");
            navigate("/");
          }
        }
      } else {
        // This else statement is in case there no user is logged in and they attempt to navigate to a user profile
        console.log("No token found, navigating home");
        navigate("/");
      }
    };

    validateToken();
  }, []); // The empty array as a dependency means this effect will run once when the component mounts

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="user-profile-container">
      {isEditModalOpen && (
        <div className="animation">
          <EditProfileModal setIsEditModalOpen={setIsEditModalOpen} />
        </div>
      )}
      {isBillingInfoModalOpen && (
        <div className="animation">
          <BillingInfoModal
            setIsBillingInfoModalOpen={setIsBillingInfoModalOpen}
          />
        </div>
      )}
      {isShippingInfoModalOpen && (
        <div className="animation">
          <ShippingInfoModal
            setIsShippingInfoModalOpen={setIsShippingInfoModalOpen}
          />
        </div>
      )}
      {showConfirmLogout && (
        <div className="confirm-logout-modal-container animation">
          <div className="confirm-logout-modal-content">
            <h2>Are you sure you want to logout?</h2>
            <div>
              <button onClick={handleLogoutClick} className="decision-button">
                Yes
              </button>
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="decision-button"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="user-info-container">
        <div className="profile-logo-wrapper">
          <img
            src={logoImg}
            alt="Dirty Burger Logo"
            className="profile-logo-img"
          />
          <h1> Dirty Burger Profile </h1>
          <div className="logout-button-wrapper">
            <button
              className="logout-button"
              onClick={() => setShowConfirmLogout(true)}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="user-profile-top-wrapper">
          <h2>User Information:</h2>
        </div>

        <div className="user-detail">
          <h4> Name: </h4>
          <p>{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</p>
        </div>
        <div className="user-detail">
          <h4> Email: </h4>
          <p>{user ? emailMask(user.email) : "Loading..."}</p>
        </div>
        <div className="user-detail">
          <h4> Password: </h4>
          <p>********</p>
        </div>
        <div className="user-detail">
          <h4> Orders Placed </h4>
          <p>0</p>
        </div>
        <div className="user-detail">
          <h4> Member Since: </h4>
          <p>
            {user
              ? new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Loading..."}
          </p>
        </div>
      </div>
      <div className="info-container">
        <div className="info-button-container">
          <label htmlFor="shipping-info" className="info-label">
            Manage your addresses
            <button
              id="shipping-info"
              className="info-modal-button"
              onClick={() => setIsShippingInfoModalOpen(true)}
            >
              Your Addresses
            </button>
          </label>
        </div>
        <div className="info-button-container">
          <label htmlFor="billing-info" className="info-label">
            Manage payment methods
            <button
              id="billing-info"
              className="info-modal-button"
              onClick={() => setIsBillingInfoModalOpen(true)}
            >
              Billing Info
            </button>
          </label>
        </div>
        <div className="info-button-container">
          <label htmlFor="edit-info" className="info-label">
            Edit profile information
            <button
              id="edit-info"
              className="info-modal-button"
              onClick={() => setIsEditModalOpen(true)}
            >
              Profile Info
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="edit-profile-icon"
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
