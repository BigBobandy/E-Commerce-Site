import { createContext, useEffect, useState } from "react";

// Using the `createContext` function from React to create a new context.
// This context will be used to share the user's data and addresses across components.
const UserContext = createContext();

// Creating a provider component for the UserContext.
// This component will provide the user's data and addresses to all components inside of it.
const UserProvider = ({ children }) => {
  // Define state variables for user and addresses.
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

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
    // Remove addresses from state
    setAddresses([]);
    // Clear token from local storage
    localStorage.removeItem("token");
  };

  // Using the `useEffect` hook to validate the JWT and fetch addresses when the application starts.
  // If the JWT is valid, the user's data will be updated in state, effectively logging them in.
  useEffect(() => {
    const initializeUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Send fetch request to validate token
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

          // Throw an error if response is not ok
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // If response is ok, extract user data and update user state
          const data = await response.json();
          setUser(data.user);

          // Fetch existing addresses for the user
          const addressResponse = await fetch(
            "http://localhost:3000/api/shipping-info/get-shipping-info",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Throw an error if address response is not ok
          if (!addressResponse.ok) {
            throw new Error(`HTTP error! status: ${addressResponse.status}`);
          }

          // If address response is ok, extract addresses and update addresses state
          const addressData = await addressResponse.json();
          setAddresses(addressData);
        } catch (error) {
          // Log any errors to console
          console.error(error);
        }
      }
    };

    // Call function that validates a user JWT and fetches their address information if it exists
    initializeUserData();
  }, []); // The empty array as a dependency means this effect will run once when the component mounts

  // Provider component provides user and addresses state, login and logout functions to children
  return (
    <UserContext.Provider
      value={{ user, setUser, login, logout, addresses, setAddresses }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
