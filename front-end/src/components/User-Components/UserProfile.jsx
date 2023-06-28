import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/borger-logo.png";
import { UserContext } from "../User-Components/UserContext";
import "../styles/User-Styles/UserProfile.css";
import EditProfileModal from "./EditProfileModal";

function UserProfile() {
  const { user, logout } = useContext(UserContext); // get the user and logout function from the context
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const navigate = useNavigate();

  // Navigate to home page if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="user-profile-container">
      {isEditModalOpen && (
        <EditProfileModal setIsEditModalOpen={setIsEditModalOpen} />
      )}
      {showConfirmLogout && (
        <div className="confirm-logout-modal-container">
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
          <FontAwesomeIcon
            className="edit-profile-button"
            onClick={() => setIsEditModalOpen(true)}
            icon={faPenToSquare}
          />
        </div>

        <div className="user-detail">
          <h4> Name: </h4>
          <p>{`${user.firstName} ${user.lastName}`}</p>
        </div>
        <div className="user-detail">
          <h4> Email: </h4>
          <p>{user.email}</p>
        </div>
        <div className="user-detail">
          <h4> Password: </h4>
          <p>
            <p>********</p>
          </p>
        </div>
        <div className="user-detail">
          <h4> Member Since: </h4>
          <p>
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="shipping-billing-info-container">
        <div className="shipping-info">
          <h2>Shipping Information:</h2>
          <div className="user-detail">
            <h4> Address:</h4>
            <p>user's address</p>
          </div>
          <div className="user-detail">
            <h4> City:</h4>
            <p>user's city</p>
          </div>
          <div className="user-detail">
            <h4> State:</h4>
            <p>user's state</p>
          </div>
          <div className="user-detail">
            <h4> Zip Code:</h4>
            <p>user's zip code</p>
          </div>
        </div>
        <div className="billing-info">
          <h2>Billing Information:</h2>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
