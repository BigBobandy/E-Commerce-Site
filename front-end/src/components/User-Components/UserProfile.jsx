import { useContext, useState } from "react";

function UserProfile() {
  const { user, logout } = useContext(UserContext); // get the user and logout function from the context

  return (
    <div>
      <h1>Welcome to your Dirty Burger Profile!</h1>
    </div>
  );
}

export default UserProfile;
