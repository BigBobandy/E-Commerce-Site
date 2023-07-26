import "../../styles/Page-Styles/Menu.css";

function Menu({ addToCart, menuItems }) {
  // This function is for formatting the category name to make it lowercase so it can be used for the class name.
  function formatStringLowercase(string) {
    return string.toLowerCase().replace(" ", "-");
  }

  function formatIdToClassName(id) {
    return `image-${id}`;
  }

  // Function to render items in a category
  const renderCategory = (category) => (
    <div className={formatStringLowercase(category)} key={category}>
      <h2 className="category-title">{category}</h2>
      <div className="menu-items-wrapper">
        {menuItems[category]?.map((item) => (
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
              <button className="item-button" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
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
    </div>
  );
}

export default Menu;
