import { useContext, useEffect, useState } from "react";
import "../../styles/User-Styles/EditProfileModal.css";
import "../../styles/User-Styles/PasswordChange.css";
import PasswordChange from "./PasswordChange";
import { UserContext } from "./UserContext";

function EditProfileModal({ setIsEditModalOpen }) {
  const { user, setUser } = useContext(UserContext);
  const [newFirstName, setNewFirstName] = useState(user.firstName);
  const [newLastName, setNewLastName] = useState(user.lastName);
  const [message, setMessage] = useState("");
  const [isPasswordChangeShown, setPasswordChangeShown] = useState(false);

  useEffect(() => {
    setNewFirstName(user.firstName);
    setNewLastName(user.lastName);
    setMessage("");
  }, [user]);

  // Helper function for handling capitalizing the first character in first or last name
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Function to handle changing to a user's first and/or last name
  async function handleSubmit(e) {
    e.preventDefault();

    // Clear any previous messages
    setMessage("");

    // Input validation
    // Prevent the user from submitting changes without making changes to the name first
    if (newFirstName === user.firstName && newLastName === user.lastName) {
      setMessage("No changes detected.");
      return;
    }

    // Prevent the user from submitting an empty field
    if (newFirstName.trim() === "" || newLastName.trim() === "") {
      setMessage("Names cannot be empty.");
      return;
    }

    // Prevent the user from using numbers or special characters in their name
    if (!/^[a-zA-Z]+$/.test(newFirstName) || !/^[a-zA-Z]+$/.test(newLastName)) {
      setMessage("Names can only contain letters.");
      return;
    }

    // Object of new names that will sent to the back-end on submit
    const updatedUser = {
      firstName: capitalizeFirstLetter(newFirstName),
      lastName: capitalizeFirstLetter(newLastName),
    };

    try {
      // get the JWT from local storage
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/user/${user.userUrlString}/change-name`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      // In case of a bad request
      if (!response.ok) {
        // If the status code is 429, it means the user has made too many requests
        // Inform the user about the situation
        if (response.status === 429) {
          const responseData = await response.json();
          setMessage(responseData.error);
        } else {
          // For other errors, the server should return a message in case of an error
          // This message will be displayed to the user
          const errorMessage = await response.json();
          throw new Error(errorMessage);
        }
      } else {
        const updatedUser = await response.json();

        // If response is okay clear any previous error messages
        setMessage("");

        // After successfully updating the user, update the user in the UserContext.
        // This assumes you have a setUser function in your UserContext.
        setUser(updatedUser);

        // Close the edit modal after success
        setIsEditModalOpen(false);

        // Display a success message
        setMessage("User updated successfully!");

        // Forcing a page reload here so that the new user information is displayed correctly
        window.location.reload();
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="edit-modal-container">
      <div className="edit-modal-content">
        <h1>Edit your profile:</h1>
        <button
          className="edit-modal-close"
          onClick={() => setIsEditModalOpen(false)}
        >
          X
        </button>
        {isPasswordChangeShown ? (
          <div className="animation">
            <PasswordChange setPasswordChangeShown={setPasswordChangeShown} />
          </div>
        ) : (
          <>
            <div className="edit-detail-wrapper">
              <div className="edit-user-detail">
                <h4> First Name: </h4>
                <input
                  type="text"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                />
              </div>
              <div className="edit-user-detail">
                <h4> Last Name: </h4>
                <input
                  type="text"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                />
              </div>
              <div className="password-reset-container">
                <a
                  className="password-reset-link"
                  onClick={() => setPasswordChangeShown(true)}
                >
                  Reset password
                </a>
              </div>
            </div>
            {message && <p className="edit-profile-message">{message}</p>}
            <button className="submit-changes-button" onClick={handleSubmit}>
              Submit Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProfileModal;
