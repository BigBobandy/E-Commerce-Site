import {
  faCcDiscover,
  faCcMastercard,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarDays,
  faCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useCardGenerator } from "../../helpers/useCardGenerator";
import "../../styles/Modal-Styles/CreateCardModal.css";

function CreateCardModal({
  setIsCreateCardModalOpen,
  setCardInfo,
  userFirstName,
  userLastName,
}) {
  const [newCard, setNewCard] = useState({
    cardType: null,
    cardNumber: "XXXX XXXX XXXX XXXX",
    expiryDate: "MM/YY",
    cvv: "XXX",
    cardHolder: `${userFirstName} ${userLastName}`,
  });
  const [message, setMessage] = useState("");
  const [acknowledgeDisclaimer, setAcknowledgeDisclaimer] = useState(false);
  const [isCardGenerated, setIsCardGenerated] = useState(false);
  const { generateCard } = useCardGenerator(newCard, setNewCard);

  // handler for form submission
  async function handleAddCard(e) {
    e.preventDefault();

    // Clear any previous messages
    setMessage("");

    // User must acknowledge disclaimer before submitting address
    if (!acknowledgeDisclaimer) {
      setMessage("Please acknowledge the disclaimer before proceeding.");
      return;
    }

    // Get the JWT from local storage
    const token = localStorage.getItem("token");

    try {
      // make the POST request to add the card
      const response = await fetch(
        "http://localhost:3000/api/billing-info/create-card",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newCard,
            cvv: newCard.cvv.toString(),
          }),
        }
      );

      // If response isn't okay throw an error and display it
      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error);
      }

      // If the request was successful, add the new card to the card array
      const data = await response.json();
      setMessage("Card added successfully!");
      setCardInfo((prevCardInfo) => [...prevCardInfo, newCard]);
      setNewCard({});

      setTimeout(() => {
        setIsCreateCardModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Error adding card: ", err);
      setMessage(err.message);
    }
  }

  return (
    <div className="modal-container">
      <div className="create-card-modal-content">
        <div className="create-card-modal-header">
          <h1>Create a new card</h1>
          <button
            className="modal-close"
            onClick={() => setIsCreateCardModalOpen(false)}
          >
            X
          </button>
        </div>
        <div className="message-wrapper">
          {message && <p className="submit-message message">{message}</p>}
        </div>
        <div className="form-wrapper">
          <form onSubmit={handleAddCard} className="card-form">
            <div className="card-form-row ">
              <div className="field">
                <label htmlFor="cardNumber">Card Number</label>
                <div className="input-icon-wrapper">
                  <input
                    id="cardNumber"
                    type="text"
                    value={newCard.cardNumber}
                    disabled
                  />
                  {newCard.cardType === "Visa" && (
                    <FontAwesomeIcon icon={faCcVisa} />
                  )}
                  {newCard.cardType === "MasterCard" && (
                    <FontAwesomeIcon icon={faCcMastercard} />
                  )}
                  {newCard.cardType === "Discover" && (
                    <FontAwesomeIcon icon={faCcDiscover} />
                  )}
                  {newCard.cardType === null && (
                    <FontAwesomeIcon icon={faCreditCard} />
                  )}
                </div>
              </div>
            </div>
            <div className="card-form-row ">
              <div className="field">
                <label htmlFor="expiryDate">Expiry Date</label>
                <div className="input-icon-wrapper">
                  <input
                    id="expiryDate"
                    type="text"
                    value={newCard.expiryDate}
                    disabled
                  />
                  <FontAwesomeIcon icon={faCalendarDays} />
                </div>
              </div>
              <div className="field ">
                <label htmlFor="cvv">CVC/CVV</label>
                <input id="cvv" type="text" value={newCard.cvv} disabled />
              </div>
            </div>
            <div className="card-form-row ">
              <div className="field">
                <label htmlFor="cardHolderName">Card holder name</label>
                <input
                  id="cardHolderName"
                  type="text"
                  value={newCard.cardHolder}
                  disabled
                />
              </div>
            </div>

            <div className="gen-button-wrapper">
              <button
                className="generate-button"
                type="button"
                onClick={() => {
                  const generatedCard = generateCard();
                  setNewCard(generatedCard);
                  setIsCardGenerated(true);
                }}
              >
                Generate Card
              </button>
            </div>

            <div className="button-wrapper card-submit-wrapper">
              <div className="disclaimer-wrapper">
                <div className="disclaimer-container">
                  <small className="disclaimer">
                    Disclaimer: This site is a portfolio demonstration. It does
                    not process real transactions, and it does not store any
                    real payment or personal information. The "card" you
                    "create" here is purely fictional and generated by the
                    system for demonstration purposes.
                  </small>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      className="hidden-checkbox"
                      checked={acknowledgeDisclaimer}
                      onChange={(e) =>
                        setAcknowledgeDisclaimer(e.target.checked)
                      }
                    />
                    <span className="custom-checkbox">
                      {acknowledgeDisclaimer && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </span>
                  </label>
                </div>
              </div>
              {isCardGenerated && (
                <button className="submit-button" type="submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCardModal;
