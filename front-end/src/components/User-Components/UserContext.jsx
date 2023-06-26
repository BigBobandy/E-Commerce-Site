import { createContext, useEffect, useState } from "react";

// Using the `createContext` function from React to create a new context.
// This context will be used to share the user's data across components.
const UserContext = createContext();

// Creating a provider component for the UserContext.
// This component will provide the user's data to all components inside of it.
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Defining a function that logs the user in.
  // This function accepts an object with the user's data and stores it in state.
  // It also stores the user's JWT (JSON Web Token) in local storage.
  const login = (userData) => {
    // Store user data in state
    setUser(userData);
    // Store token in local storage
    localStorage.setItem("token", userData.token);
  };

  // Defining a function that logs the user out.
  // This function clears the user's data from state and removes the JWT from local storage.
  const logout = () => {
    // Remove user data from state
    setUser(null);
    // Remove token from local storage
    localStorage.removeItem("token");
  };

  // Using the `useEffect` hook to validate the JWT when the application starts.
  // It does this by checking the local storage for a JSON web token that was stored when the user last logged in
  // It then sends a fetch request to the server with the token found in the local storage
  // The server will then attempt to validate the token
  // If the JWT is valid, then update the user's data in state, logging them in, so that the user doesn't have to login again.
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      console.log("validateToken function was called in UserContext.jsx");
      console.log(`Token from local storage: ${token}`);

      if (token) {
        try {
          const response = await fetch(
            "http://localhost:3000/login/validate-token",
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

          const data = await response.json();
          setUser(data.user);
          console.log("Token validated");
        } catch (error) {
          console.error(error);
        }
      }
    };

    validateToken();
  }, []); // The empty array as a dependency means this effect will run once when the component mounts

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
