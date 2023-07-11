import { useContext, useState } from "react";
import "../../styles/User-Styles/BillingInfoModal.css";
import CreateCardModal from "./CreateCardModal";
import { UserContext } from "./UserContext";

function BillingInfoModal({ setIsBillingInfoModalOpen }) {
  const { user } = useContext(UserContext);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [cards, setCards] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="billing-info-modal-container">
      <div className="billing-info-modal-content">
        {isCreateCardModalOpen && (
          <CreateCardModal
            setIsCreateCardModalOpen={setIsCreateCardModalOpen}
            setCards={setCards}
            userFirstName={user.firstName}
            userLastName={user.lastName}
          />
        )}
        <div className="billing-modal-header">
          <h2>Your Payment Methods</h2>
          <button
            className="billing-info-modal-close"
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
          {cards &&
            cards.map((card) => (
              <div className="card-tile" key={card.id}>
                <p>**** **** **** {card.lastFourDigits}</p>
                <p>
                  {card.expiryMonth}/{card.expiryYear}
                </p>
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
