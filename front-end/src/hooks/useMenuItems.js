import { useEffect, useState } from "react";
import { apiUrl } from "../helpers/config";

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState({
    Main: [],
    Sides: [],
    Drinks: [],
    Desserts: [],
  });

  // Hook that fetches menuItems from the database and passes them to the menu and checkout components
  useEffect(() => {
    // Function to fetch menu items from the server
    async function fetchMenuItems() {
      try {
        const response = await fetch(`${apiUrl}/api/menu-items`);

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }

        // Parse the response data
        const data = await response.json();

        // Initialize an object to store categorized items
        const categorizedItems = {
          Main: [],
          Sides: [],
          Drinks: [],
          Desserts: [],
        };

        // Iterate through each item and push it to the corresponding category
        data.forEach((item) => {
          categorizedItems[item.category].push(item);
        });

        // Update the state with the categorized items
        setMenuItems(categorizedItems);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Call the fetchMenuItems function when the component mounts
    fetchMenuItems();
  }, []);
  return menuItems;
}
