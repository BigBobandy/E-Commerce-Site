import { useState } from "react";

export function useEmailResend() {
  // Function to handle re-sending the confirmation email if the user hasn't confirmed it after a certain time
  async function handleResendEmail(email) {
    try {
      // Send the email the user entered earlier to the server
      const response = await fetch(
        "http://localhost:3000/api/signup/resend-confirmation-email",
        {
          method: "POST", // Type of request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Check if the server's response is ok (status in the range 200-299)
      return response.ok;
    } catch (error) {
      // Log the error if an error occurs while sending the request
      console.error("Error during the request:", error);
      return false;
    }
  }

  return { handleResendEmail };
}
