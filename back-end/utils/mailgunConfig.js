require("dotenv").config();
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: API_KEY });

module.exports = { client, API_KEY, DOMAIN };
