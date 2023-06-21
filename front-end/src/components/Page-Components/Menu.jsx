import { useEffect, useState } from "react";
import "../styles/Page-Styles/Menu.css";

function Menu() {
  const [menuItems, setMenuItems] = useState({
    Main: [],
    Sides: [],
    Drinks: [],
    Desserts: [],
  });

  useEffect(() => {
    fetch("http://localhost:3000/menu-items")
      .then((response) => response.json())
      .then((data) => {
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

        setMenuItems(categorizedItems);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []);

  // This function is for formatting the category name to make it lowercase so it can be used for the class name.
  function formatStringLowercase(string) {
    return string.toLowerCase().replace(" ", "-");
  }

  function formatIdToClassName(id) {
    console.log(id);
    return `image-${id}`;
  }

  // Function to render items in a category
  const renderCategory = (category) => (
    <div className={formatStringLowercase(category)} key={category}>
      <h2 className="category-title">{category}</h2>
      <div className="menu-items-wrapper">
        {menuItems[category].map((item) => (
          <div className="menu-item" key={item.id}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className={formatIdToClassName(item.id)}
            />
            <div className="item-details">
              <h3 className="item-title">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-price">${item.price}</p>
            </div>
            {item.quantity === 0 ? (
              <p>Out of Stock</p>
            ) : (
              <button className="item-button">Add to Cart</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="Menu-Parent">
      <h1>Dirty Burger Menu</h1>
      {["Main", "Sides", "Drinks", "Desserts"].map(renderCategory)}
      <small className="disclaimer-text">
        Disclaimer: Our slushies, shakes and sundaes may arrive in hot liquid
        form.
      </small>
    </div>
  );
}

export default Menu;
