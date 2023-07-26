import { useEffect, useState } from "react";

export function useCart() {
  // Initialize cart state from localStorage if it's available there
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    } else {
      return [];
    }
  });

  // Update localStorage whenever the cart state changes
  useEffect(() => {
    // Stringify and store cart in localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function to add an item to the cart array
  const addToCart = (itemToAdd) => {
    // Check if the item is already in the cart
    const existingCartItem = cart.find((item) => item.id === itemToAdd.id);

    if (existingCartItem) {
      // If the item is already in the cart, map through the cart
      // and return a new array with matching item's quantity incremented.
      setCart(
        cart.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If the item isn't in the cart yet, add it with a quantity of 1.
      setCart([...cart, { ...itemToAdd, quantity: 1 }]);
    }
  };

  // Function for removing an item from the cart's state
  const removeFromCart = (idToRemove) => {
    // Find the item in the cart that matches the ID of the item to remove.
    const itemToRemove = cart.find((item) => item.id === idToRemove);

    // If the quantity of the item to remove is greater than 1...
    if (itemToRemove.quantity > 1) {
      // Use the setCart function to update the cart. Do this by mapping through
      // every item in the cart. If the item's ID matches the ID of the item to
      // remove, create a new object that is a copy of the item, but with its
      // quantity reduced by 1. If the item's ID does not match, we return the item
      // as is.
      setCart(
        cart.map((item) =>
          item.id === idToRemove
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      // If the quantity of the item to remove is 1 (or less), then the item needs
      // to be completely removed from the cart. Start by finding the index
      // of the item to remove.
      const indexToRemove = cart.findIndex((item) => item.id === idToRemove);

      // If the item was found in the cart...
      if (indexToRemove !== -1) {
        // Use the setCart function to update the cart. Create a new
        // array that includes all items in the cart except the one to remove.
        // Use the spread operator (...) to create copies of slices of the
        // original cart array: one slice before the item to remove, and one slice
        // after the item to remove.
        setCart([
          ...cart.slice(0, indexToRemove),
          ...cart.slice(indexToRemove + 1),
        ]);
      }
    }
  };

  // Function to remove all items from the cart and set it back to default
  const clearCart = () => {
    // The clearCart function is much simpler: it uses the setCart function to
    // replace the current cart with an empty array, effectively removing all
    // items from the cart.
    setCart([]);
  };

  // Calculate the total cost of the items in the cart
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function that calculates how many items are in the cart
  const totalItems = cart.reduce((total, item) => {
    // `total` is the accumulator that keeps track of the total quantity of items in the cart.
    // On the first call, it is initialized to `0`.

    // `item` is the current item being processed in the cart array.

    // For each item in the cart, add its quantity to the total.
    return total + item.quantity;

    // start with an initial total of `0`.
  }, 0);

  // Return the values and functions as an object
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalCost,
    totalItems,
  };
}
