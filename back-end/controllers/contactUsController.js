const { client: mailgunClient } = require("../utils/mailgunConfig");

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

  const messageData = {
    from: "Dirty Burger <dirtyburgerdev@gmail.com>",
    to: "dirtyburgerdev@gmail.com",
    subject: "New Contact Us Submission",
    text: `Submitted by: ${email}`,
    html: emailContent,
  };

  try {
    const result = await mailgunClient.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendContactEmail };
