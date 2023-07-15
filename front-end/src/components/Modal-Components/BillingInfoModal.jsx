import {
  faCcDiscover,
  faCcMastercard,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import "../../styles/Modal-Styles/BillingInfoModal.css";
import { UserContext } from "../User-Components/UserContext";
import CreateCardModal from "./CreateCardModal";

function BillingInfoModal({ setIsBillingInfoModalOpen }) {
  const { user, cardInfo, setCardInfo } = useContext(UserContext);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Function to mask the card number except for the last four digits
  function maskCardNumber(cardNumber) {
    // Remove spaces from the card number
    const noSpaceCardNumber = cardNumber.replace(/ /g, "");

    // Get the last four digits
    const lastFourDigits = noSpaceCardNumber.slice(-4);

    // Create the mask
    const mask = "*".repeat(noSpaceCardNumber.length - 4);

    // Combine mask with last four digits
    const maskedCardNumber = mask + lastFourDigits;

    // Insert spaces every four characters
    const formattedCardNumber = maskedCardNumber
      .replace(/(.{4})/g, "$1 ")
      .trim();

    return formattedCardNumber;
  }

  console.log(cardInfo);

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
                  <button className="card-button">Remove</button>
                  {card.isDefault ? (
                    <small className="default-card-tag">
                      Is Default <small className="default-check">✔</small>
                    </small>
                  ) : (
                    <button className="card-button">Set Default</button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BillingInfoModal;
