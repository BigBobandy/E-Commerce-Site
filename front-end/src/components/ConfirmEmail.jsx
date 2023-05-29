import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmEmail() {
  const navigate = useNavigate();

  useEffect(
    () => {
      // After 3 seconds the user gets redirected to the home page
      setTimeout(() => {
        navigate("/");
      }, 3000);
    },
    { navigate }
  );

  return (
    <div>
      <h2>
        Thanks for confirming your email! You will be redirected to the home
        page shortly
      </h2>
    </div>
  );
}

export default ConfirmEmail;
