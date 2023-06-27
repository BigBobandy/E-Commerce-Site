import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

function ConfirmEmail() {
  const navigate = useNavigate();
  // Accessing the email confirmation code parameter with the useParams hook from react-router
  const { codeParam } = useParams();
  // state to handle the message to be displayed
  const [message, setMessage] = useState("");
  // state to track whether or not the confirmation was successful
  const emailConfirmedRef = useRef(false); // using a mutable reference here to track confirmation
  // state for a popup that will let the user confirm their email
  const [showModal, setShowModal] = useState(false);

  // This hook is responsible for sending a GET request to the server when the component mounts
  useEffect(() => {
    // This async function will send a GET request to the server to confirm the user's email
    const confirmEmail = async () => {
      // Only make the request if we haven't successfully confirmed the email during this component's rendering yet
      if (!emailConfirmedRef.current) {
        const response = await fetch(
          `http://localhost:3000/api/confirm/${codeParam}`
        );

        if (response.ok) {
          // If the email was confirmed successfully, update the message and
          // then redirect the user to the home page after 3 seconds.
          setMessage(
            "Thanks for confirming your email! You will be redirected to the home page shortly."
          );

          emailConfirmedRef.current = true; // set the ref's current value to true

          // Send the user to the home page after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);

          // If the email couldn't be confirmed with the initial GET request for some reason
          // Allow user to manually enter the code for confirmation in the ConfirmationModal
        } else {
          setMessage(
            "There was an error confirming your email. Please click below to try again."
          );
        }
      }
    };

    // calling the confirmEmail function to send the GET request
    confirmEmail();

    // return function to useEffect which is called when component unmounts.
    return () => {};
  }, [codeParam, navigate]);

  return (
    <div>
      <h1>Welcome!</h1>
      <h2>{message}</h2>
      {!emailConfirmedRef.current && (
        <button
          className="manual-confirm-btn"
          onClick={() => setShowModal(true)}
        >
          Click to manually confirm
        </button>
      )}
      {showModal && (
        <ConfirmationModal
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default ConfirmEmail;
