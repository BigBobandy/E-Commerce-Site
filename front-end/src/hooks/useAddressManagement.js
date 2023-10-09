import { useState } from "react";

export function useAddressManagement() {
  const [addresses, setAddresses] = useState([]);

  //// GETTING THE USER'S ADDRESS INFORMATION ////
  // Fetch existing addresses for the user
  // This will be added to context

  const fetchAddresses = async (token) => {
    try {
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

      if (!addressResponse.ok) {
        throw new Error(`HTTP error! status: ${addressResponse.status}`);
      }

      const addressData = await addressResponse.json();
      setAddresses(addressData);
    } catch (error) {
      console.error(error);
    }
  };

  return { addresses, setAddresses, fetchAddresses };
}
