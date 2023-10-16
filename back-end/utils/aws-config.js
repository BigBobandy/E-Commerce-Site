const { SESClient } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

module.exports = { sesClient };
