const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Use body-parser middleware to parse incoming JSON
app.use(bodyParser.json());

app.use(cors());

// Import routes
const signupRoutes = require("./routes/signupRoutes");
const confirmRoutes = require("./routes/confirmRoutes");

// Use routes
app.use("/signup", signupRoutes);
app.use("/confirm", confirmRoutes);
app.use("/confirm/:codeParam", confirmRoutes);

// Set the port that the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// USE MAILGUN FOR SENDING EMAILS LATER
