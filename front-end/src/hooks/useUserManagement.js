import { useState } from "react";
import { apiUrl } from "../helpers/config";

export function useUserManagement() {
  const [user, setUser] = useState(null);

  //// VALIDATING USER'S JWT ////
  // Send fetch request to validate token
  // All of the user's information is in the token and this will be added to context
  const validateToken = async (token) => {
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/api/login/validate-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Defining a function that logs the user in.
  // This function accepts an object with the user's data and token and stores it in state and local storage.
  const login = (userData) => {
    // Store user data in state
    setUser(userData);
    // Store token in local storage for persistence across sessions
    localStorage.setItem("token", userData.token);
  };

  // Defining a function that logs the user out.
  // This function clears the user's data from state and removes the JWT from local storage.
  const logout = () => {
    // Remove user data from state
    setUser(null);
    // Clear token from local storage
    localStorage.removeItem("token");
  };

  return { user, setUser, login, logout, validateToken };
}
