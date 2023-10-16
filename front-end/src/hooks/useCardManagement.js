import { useState } from "react";
import { apiUrl } from "../helpers/config";

export function useCardManagement() {
  const [cardInfo, setCardInfo] = useState(null);

  //// GETTING THE USER'S CARD INFORMATION ////
  // Fetch existing cardInfo for the user and will be used in context
  const fetchCardInfo = async (token) => {
    if (token) {
      try {
        const cardResponse = await fetch(
          `${apiUrl}/api/billing-info/get-card-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cardResponse.ok) {
          throw new Error(`HTTP error! status: ${cardResponse.status}`);
        }

        const cardData = await cardResponse.json();
        setCardInfo(cardData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { cardInfo, setCardInfo, fetchCardInfo };
}
