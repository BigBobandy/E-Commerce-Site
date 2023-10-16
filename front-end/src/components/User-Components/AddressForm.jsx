import { useEffect } from "react";
import { COUNTRIES } from "../../helpers/COUNTRIES";
import { US_STATES } from "../../helpers/US-STATES";
import "../../styles/User-Styles/AddressForm.css";

function AddressForm({ newAddress, setNewAddress }) {
  // handler for form input changes
  function handleInputChange(e) {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  }

  // Clear the state field when the user selects a new country
  // This solves a problem that happens if a user selects a US state and then changes the country to something else
  useEffect(() => {
    setNewAddress((prev) => ({ ...prev, state: "", stateAbbrev: "" }));
  }, [newAddress.country]); // Runs whenever newAddress.country changes

  return (
    <form className="add-address-form">
      <div className="field">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          className="country-select"
          value={newAddress.country || "United States of America"}
          onChange={(e) =>
            setNewAddress({
              ...newAddress,
              country: e.target.value,
              countryAbbrev: COUNTRIES[e.target.value],
            })
          }
        >
          {Object.keys(COUNTRIES).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="name-input-group">
        <div className="field">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="First Name..."
            value={newAddress.firstName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Last Name..."
            value={newAddress.lastName || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="address">Street</label>
        <input
          id="address"
          type="text"
          name="address"
          placeholder="Street Address..."
          value={newAddress.address || ""}
          onChange={handleInputChange}
        />
      </div>
      {newAddress.country === "United States of America" ? (
        <div className="us-input-group">
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              className="city-input"
              value={newAddress.city || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              className="state-select"
              value={newAddress.state || ""}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  state: e.target.value,
                  stateAbbrev: US_STATES[e.target.value],
                })
              }
            >
              {newAddress.state === "" && (
                <option value="" disabled>
                  State
                </option>
              )}
              {Object.keys(US_STATES).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="field ">
            <label htmlFor="zip">Zip Code</label>
            <input
              id="zip"
              type="text"
              name="zip"
              className="zip-input"
              value={newAddress.zip || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={newAddress.city || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="state">State / Province / Region</label>
            <input
              id="state"
              type="text"
              name="state"
              value={newAddress.state || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="zip">Zip Code</label>
            <input
              id="zip"
              type="text"
              name="zip"
              value={newAddress.zip || ""}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}
    </form>
  );
}

export default AddressForm;
