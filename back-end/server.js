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
const menuRoutes = require("./routes/menuRoutes");
const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

// Use routes
app.use("/api/signup", signupRoutes);
app.use("/api/confirm", confirmRoutes);
app.use("/api/confirm/:codeParam", confirmRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user", passwordRoutes);

// Set the port that the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// USE MAILGUN FOR SENDING EMAILS LATER
