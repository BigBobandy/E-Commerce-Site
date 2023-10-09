import { createContext, useEffect } from "react";
import { useAddressManagement } from "../../hooks/useAddressManagement";
import { useCardManagement } from "../../hooks/useCardManagement";
import { useOrderManagement } from "../../hooks/useOrderManagement";
import { useUserManagement } from "../../hooks/useUserManagement";

// Using the `createContext` function from React to create a new context.
// This context will be used to share the user's data across components.
const UserContext = createContext();

// Creating a provider component for the UserContext.
// This component will provide the user's data to all components inside of it.
const UserProvider = ({ children }) => {
  const { user, setUser, login, logout, validateToken } = useUserManagement();
  const { addresses, setAddresses, fetchAddresses } = useAddressManagement();
  const { cardInfo, setCardInfo, fetchCardInfo } = useCardManagement();
  const { orderInfo, setOrderInfo, fetchOrderInfo } = useOrderManagement();

  useEffect(() => {
    // Get the JWT from localStorage once and use across all hooks
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
      fetchAddresses(token);
      fetchCardInfo(token);
      fetchOrderInfo(token);
    }
  }, []);

  // Provider component provides all the necessary functions and info to it's children
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        addresses,
        setAddresses,
        cardInfo,
        setCardInfo,
        orderInfo,
        setOrderInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
