const { google } = require('googleapis');
const privatekey = require("../security/privatekey.json");

//configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']);
//authenticate request
jwtClient.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

module.exports = jwtClient;