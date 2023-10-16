import { useState } from "react";
import { apiUrl } from "../helpers/config";

export function useOrderManagement() {
  const [orderInfo, setOrderInfo] = useState(null);

  //// GETTING ORDER INFORMATION FROM DATABASE ////
  // Fetching any existing order information the user has
  // This info will be added to the UserContext
  const fetchOrderInfo = async (token) => {
    if (token) {
      try {
        const orderResponse = await fetch(
          `${apiUrl}/api/orders/get-order-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!orderResponse.ok) {
          throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }

        const orderData = await orderResponse.json();
        setOrderInfo(orderData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { orderInfo, setOrderInfo, fetchOrderInfo };
}
