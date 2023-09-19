import {
  faCcDiscover,
  faCcMastercard,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { maskCardNumber } from "../../helpers/cardHelper";
import "../../styles/Modal-Styles/BillingInfoModal.css";
import { UserContext } from "../User-Components/UserContext";
import CreateCardModal from "./CreateCardModal";

function BillingInfoModal({ setIsBillingInfoModalOpen }) {
  const { user, cardInfo, setCardInfo } = useContext(UserContext);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  // useEffect that runs whenever message changes
  // The purpose of this useEffect is to clear any message after a timeout so that they don't linger forever
  useEffect(() => {
    // Declare a variable for the timeout ID to use for clearing the timeout later
    let timeoutId;

    // If message exists (is truthy), then start a timeout
    if (message) {
      // Set a timeout to clear the message after 15 seconds and assign the timeout ID to timeoutId
      timeoutId = setTimeout(() => {
        setMessage("");
      }, 15000);
    }

    // Return a cleanup function to be run before the next call to useEffect and on unmount
    return () => {
      // If a timeout was started (i.e., timeoutId is truthy), clear the timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]); // Run this effect whenever the `message` state changes

  // Function to handle setting a user's card as default
  async function setDefault(cardId) {
    // Clear any previous message
    setMessage("");

    // Check if the cardId is valid
    if (!cardId) {
      setMessage("Invalid Card Id");
      return;
    }

    // Send the request to the server
    try {
      // get the JWT from local storage
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/billing-info/default-card",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cardId }),
        }
      );

      // If response isn't ok
      if (!response.ok) {
        // If the status code is 429, it means the user has made too many requests
        // Inform the user about the situation
        if (response.status === 429) {
          const responseData = await response.json();
          setMessage(responseData.error);
          return;
        }

        throw new Error("Error setting the default card");
      }

      // Request is successful get the data
      const data = await response.json();

      // Display the success message from the server
      setMessage(data.message);

      // If the request is successful, update the cards in the context
      // Here I create a new list of cards from the current list of cards
      const updatedCardInfo = cardInfo.map((card) =>
        // For each card, check if its id matches the cardId that was passed in the function
        card.id === cardId
          ? // If it does, this is the new default card so mark isDefault as true
            { ...card, isDefault: true }
          : // If it doesn't, this isn't the default card but mark isDefault as false
            { ...card, isDefault: false }
      );
      // updatedCardInfo is now a new list where only the new default card is marked as isDefault
      setCardInfo(updatedCardInfo);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Function to handle deleting a user's card
  async function deleteCard(cardId) {
    // Clear any previous messages
    setMessage("");

    // Check if the cardId is valid
    if (!cardId) {
      setMessage("Invalid Card Id");
      return;
    }

    // If this is the user's last card, confirm with the user
    if (cardInfo.length === 1) {
      const confirmation = window.confirm(
        "Are you sure you want to delete your last card?"
      );
      if (!confirmation) {
        return;
      }
    }

    // Send the request to the server
    try {
      // Get the JWT from local storage
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/billing-info/delete-card/${cardId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If something goes wrong and response is not ok show the user the error message
      if (!response.ok) {
        // Handle different error status codes
        const responseData = await response.json();
        // Set the message state to the error returned by the API
        setMessage(responseData.error);

        // Throw an error to stop the execution and trigger the catch block
        throw new Error("Error deleting the card");
      } else {
        // If response is OK, then parse the JSON data from the response
        const responseData = await response.json();

        // If the request is successful, remove the deleted cardInfo from the context
        let updatedCardInfo = cardInfo.filter((card) => card.id !== cardId);

        // If the response includes a new default card, update the default card in the state
        if (responseData.defaultCard) {
          // Find the new default card in the updatedCardInfo array and set isDefault to true
          updatedCardInfo = updatedCardInfo.map((card) =>
            card.id === responseData.defaultCard.id
              ? { ...card, isDefault: true }
              : card
          );
        }

        // Update the cardInfo in the context
        setCardInfo(updatedCardInfo);
        // Set the message state to a successful message
        setMessage("Card deleted successfully.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <div className="modal-container">
      <div className="billing-info-modal-content">
        {isCreateCardModalOpen && (
          <div className="animation">
            <CreateCardModal
              setIsCreateCardModalOpen={setIsCreateCardModalOpen}
              setCardInfo={setCardInfo}
              userFirstName={user.firstName}
              userLastName={user.lastName}
            />
          </div>
        )}
        <div className="billing-modal-header">
          <h2>Your Payment Methods</h2>
          <button
            className="modal-close"
            onClick={() => setIsBillingInfoModalOpen(false)}
          >
            X
          </button>
        </div>
        <div className="message-wrapper">
          {message && <p className="submit-message message">{message}</p>}
        </div>
        <div className="cards-container">
          <div
            className="card-tile add-card-tile"
            onClick={() => setIsCreateCardModalOpen(true)}
          >
            <span>+</span>
            <p>Add Payment Method</p>
          </div>
          {cardInfo &&
            cardInfo.map((card) => (
              <div className="card-tile" key={card.id}>
                <label className="tile-label">
                  <h4>Card Number</h4>
                  <h3>{maskCardNumber(card.cardNumber)}</h3>
                </label>
                <div className="card-tile-info-wrapper">
                  <label className="tile-label">
                    <h4>Exp. Date</h4>
                    <p>{card.expiryDate}</p>
                  </label>
                  <label className="tile-label">
                    <h4>CVV</h4>
                    <p>{card.cvv}</p>
                  </label>
                </div>
                <div className="card-tile-info-wrapper">
                  <p>{card.cardHolder}</p>
                  {card.cardType === "Visa" && (
                    <FontAwesomeIcon id="card-type-icon" icon={faCcVisa} />
                  )}
                  {card.cardType === "MasterCard" && (
                    <FontAwesomeIcon
                      id="card-type-icon"
                      icon={faCcMastercard}
                    />
                  )}
                  {card.cardType === "Discover" && (
                    <FontAwesomeIcon id="card-type-icon" icon={faCcDiscover} />
                  )}
                </div>
                <div className="card-button-wrapper">
                  {card.isDefault ? (
                    <small className="default-card-tag">
                      Is Default <small className="default-check">✔</small>
                    </small>
                  ) : (
                    <button
                      className="card-button"
                      onClick={() => setDefault(card.id)}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    className="card-button"
                    onClick={() => deleteCard(card.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BillingInfoModal;
