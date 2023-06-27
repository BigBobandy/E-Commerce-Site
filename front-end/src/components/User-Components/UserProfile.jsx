import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../User-Components/UserContext";
import "../styles/User-Styles/UserProfile.css";

function UserProfile() {
  const { userUrlString } = useParams();
  const { user, logout } = useContext(UserContext); // get the user and logout function from the context

  return (
    <div className="user-profile-container">
      <h1>Welcome to your Dirty Burger Profile {user.firstName}!</h1>
    </div>
  );
}

export default UserProfile;
