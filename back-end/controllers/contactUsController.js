const AWS = require("../utils/aws-config");
const ses = new AWS.SES();

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
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    // Log any errors
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
}

module.exports = { sendContactEmail };
