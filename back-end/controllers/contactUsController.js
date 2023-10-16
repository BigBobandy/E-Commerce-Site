const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/aws-config");

// Handles sending 'contact us' emails
async function sendContactEmail(req, res) {
  const { name, email, subject, message } = req.body; // Destructure formData from req.body

  // HTML content of the contact email
  // Contains all of the data received from the request
  const emailContent = `
      <h1>Contact Us Form Submitted</h1>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Subject: ${subject}</p>
      <p>Message: ${message}</p>
    `;

  // Parameters for the SES sendEmail method
  const params = {
    Destination: {
      ToAddresses: ["dirtyburgerdev@gmail.com"], // Recipient
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailContent,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New Contact Us Submission", // Emal subject
      },
    },
    Source: "dirtyburgerdev@gmail.com", // Email sender
  };

  try {
    // Attempt to send the email
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("Email sent:", result);
  } catch (error) {
    // Log any errors
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
}

module.exports = { sendContactEmail };
