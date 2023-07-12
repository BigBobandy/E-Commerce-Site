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
import "../../styles/User-Styles/CreateCardModal.css";

function CreateCardModal({
  setIsCreateCardModalOpen,
  setCards,
  userFirstName,
  userLastName,
}) {
  const [newCard, setNewCard] = useState({
    cardType: null,
    cardNumber: "XXXX XXXX XXXX XXXX",
    expiryDate: "MM/YY",
    cvv: "XXX",
    cardHolderName: `${userFirstName} ${userLastName}`,
  });
  const [message, setMessage] = useState("");
  const [acknowledgeDisclaimer, setAcknowledgeDisclaimer] = useState(false);

  // An array containing different card types.
  const cardTypes = ["Visa", "MasterCard", "Discover"];

  /**
   * This function generates a valid Luhn number based on the cardType.
   *
   * The Luhn Algorithm, also known as the modulus 10 or mod 10 algorithm, is a simple checksum
   * formula used to validate a variety of identification numbers, but most notably credit card numbers.
   * Most credit cards and many government identification numbers use the algorithm as a simple
   * method of distinguishing valid numbers from mistyped or otherwise incorrect numbers.
   *
   * The cardType affects the starting digit and length of the card number.
   */
  function generateLuhnNumber(cardType) {
    // An object that maps cardTypes to their respective lengths.
    const lengths = { Visa: 16, MasterCard: 16, Discover: 16 };

    // An object that maps cardTypes to arrays containing valid starting digits.
    const starts = { Visa: [4], MasterCard: [5], Discover: [6] };

    // Select a random starting digit for the cardType.
    let start =
      starts[cardType][Math.floor(Math.random() * starts[cardType].length)];

    // Convert the starting digit to a string to allow string concatenation later.
    let card = start.toString();

    // Retrieve the length of card numbers for the cardType.
    const length = lengths[cardType];

    // Generate the main part of the card number (not including the Luhn check digit).
    for (let i = card.length; i < length - 1; i++) {
      card += Math.floor(Math.random() * 10); // add a random digit from 0-9
    }

    // Calculate the Luhn check digit.
    let sum = 0; // stores the running sum
    let parity = length % 2; // checks if the length is odd or even
    for (let i = 0; i < length - 1; i++) {
      let digit = parseInt(card[i]); // get the i-th digit

      // double every other digit, starting with the rightmost (parity indicates where to start)
      if (i % 2 == parity) {
        digit *= 2;
        if (digit > 9) {
          // if the result is two digits, subtract 9
          digit -= 9;
        }
      }
      sum += digit; // add the processed digit to the sum
    }

    // calculate and add the Luhn check digit to the end of the card number
    card += (10 - (sum % 10)) % 10;

    return card; // return the complete card number
  }

  // This function generates a fictional expiry date that is 1 year from the current month.
  function generateExpiryDate() {
    const today = new Date(); // get the current date and time
    const month = ("0" + (today.getMonth() + 1)).slice(-2); // get the current month (0-11), add 1, pad with 0 if necessary
    const year = today.getFullYear().toString().slice(-2); // get the last 2 digits of the current year
    return `${month}/${parseInt(year) + 1}`; // return the expiry date in MM/YY format
  }

  // This function generates a fictional CVV number (3 digits).
  function generateCVV() {
    return Math.floor(100 + Math.random() * 900); // generate a random number from 100-999
  }

  // This function formats a card number by adding a space after every 4 digits.
  function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(\d{4})/g, "$1 ").trim(); // use a regular expression to add spaces, then remove trailing spaces
  }

  // This function generates a new card and updates the newCard state.
  function generateCard() {
    // randomly select a cardType
    const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    console.log(cardType);

    // generate and format the card number, generate the expiry date and CVV
    const cardNumber = formatCardNumber(generateLuhnNumber(cardType));
    const expiryDate = generateExpiryDate();
    const cvv = generateCVV();

    // update the newCard state with the generated card info
    setNewCard((prevState) => ({
      ...prevState,
      cardType,
      cardNumber,
      expiryDate,
      cvv,
    }));
  }

  return (
    <div className="create-card-modal-container">
      <div className="create-card-modal-content">
        <div className="create-card-modal-header">
          <h1>Create a new card</h1>
          <button
            className="billing-info-modal-close"
            onClick={() => setIsCreateCardModalOpen(false)}
          >
            X
          </button>
        </div>
        <div className="message-wrapper">
          {message && <p className="submit-message message">{message}</p>}
        </div>
        <div className="form-wrapper">
          <form className="card-form">
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
                  value={newCard.cardHolderName}
                  disabled
                />
              </div>
            </div>

            <div className="gen-button-wrapper">
              <button
                className="generate-button"
                type="button"
                onClick={generateCard}
              >
                Generate Card
              </button>
            </div>
          </form>
        </div>
        <div className="disclaimer-wrapper">
          <div className="disclaimer-container">
            <small className="disclaimer">
              Disclaimer: This site is a portfolio demonstration. It does not
              process real transactions, and it does not store any real payment
              or personal information. The "card" you "create" here is purely
              fictional and generated by the system for demonstration purposes.
            </small>
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="hidden-checkbox"
                checked={acknowledgeDisclaimer}
                onChange={(e) => setAcknowledgeDisclaimer(e.target.checked)}
              />
              <span className="custom-checkbox">
                {acknowledgeDisclaimer && <FontAwesomeIcon icon={faCheck} />}
              </span>
            </label>
          </div>
        </div>
        <div className="button-wrapper">
          <button className="submit-button" type="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCardModal;
