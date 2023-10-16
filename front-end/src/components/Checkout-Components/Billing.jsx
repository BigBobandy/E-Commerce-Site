import { useContext, useEffect, useState } from "react";
import { getLastFourDigits } from "../../helpers/cardHelper";
import CreateCardModal from "../Modal-Components/CreateCardModal";
import { UserContext } from "../User-Components/UserContext";

function Billing({
  userFirstName,
  userLastName,
  expandCards,
  setExpandCards,
  setExpandAddresses,
  cardSelection,
  setCardSelection,
}) {
  const { cardInfo, setCardInfo } = useContext(UserContext);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);

  useEffect(() => {
    // Check if cardInfo exists
    if (cardInfo && cardInfo.length > 0) {
      // Search for a default card in the cardInfo array
      const defaultCard = cardInfo.find((card) => card.isDefault);

      // If a default card is foiund, set it as the cardSelection
      if (defaultCard) {
        setCardSelection(defaultCard);
      }
    }
  }, [cardInfo]);

  // Function to handle selecting a payment method or in other words a card
  const handleCardSelection = (cardIndex) => {
    setCardSelection(cardInfo[cardIndex]);
  };

  return (
    <div>
      {cardSelection ? (
        <>
          {!expandCards ? (
            <div className="checkout-details-container">
              <div>
                <h2 className="checkout-step-counter">2</h2>
              </div>
              <div>
                <h3>Payment Method</h3>
              </div>
              <div className="checkout-detail-container">
                <p className="detail-choice-name">{cardSelection.cardHolder}</p>
                <p>
                  {cardSelection.cardType} Ending in{" "}
                  {getLastFourDigits(cardSelection.cardNumber)}
                </p>
                <p>Expires: {cardSelection.expiryDate}</p>
              </div>
              <div>
                <button
                  className="change-address-btn"
                  onClick={() => {
                    setExpandCards(true);
                    setExpandAddresses(false);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="detail-selection-container">
              <div className="detail-header-container">
                <h2 className="checkout-step-counter">2</h2>
                <h3>Choose a payment method</h3>
                <button
                  className="change-address-btn go-back-btn"
                  onClick={() => setExpandCards(false)}
                >
                  Close X
                </button>
              </div>
              <div className="card-info-details-container">
                <h4 className="checkout-step-counter">Your cards:</h4>
                <h4>Name on Card</h4>
                <h4>Expires On</h4>
              </div>
              <div className="detail-choice">
                {cardInfo.map((card, index) => (
                  <div key={index} className="card-choice-item">
                    <div className="checkout-input-label-container">
                      <input
                        type="radio"
                        id={`card${index}`}
                        name="cardSelection"
                        className="card-radio-btn"
                        checked={cardSelection === card}
                        onChange={() => handleCardSelection(index)}
                      />
                      <label
                        htmlFor={`card${index}`}
                        className="card-choice-label"
                      >
                        {card.cardType} Ending in{" "}
                        {getLastFourDigits(card.cardNumber)}
                      </label>
                    </div>
                    <div className="card-choice-details">
                      <p>{card.cardHolder}</p>
                      <p>{card.expiryDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="add-detail-btn"
                onClick={() => setIsCreateCardModalOpen(true)}
              >
                <span>+</span> Add new card
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="checkout-details-container ">
            <div>
              <h2 className="checkout-step-counter">2</h2>
            </div>
            <div>
              <h3>Payment Method</h3>
            </div>
            <div className="checkout-detail-container checkout-details-add-button-container">
              <button
                onClick={() => setIsCreateCardModalOpen(true)}
                className="checkout-details-add-button"
              >
                Add New Card
              </button>
            </div>
          </div>
        </>
      )}
      {isCreateCardModalOpen && (
        <div className="animation">
          <CreateCardModal
            setIsCreateCardModalOpen={setIsCreateCardModalOpen}
            userFirstName={userFirstName}
            userLastName={userLastName}
            setCardInfo={setCardInfo}
          />
        </div>
      )}
    </div>
  );
}

export default Billing;
