const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();

// Use body-parser middleware to parse incoming JSON
app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Set the port that the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
