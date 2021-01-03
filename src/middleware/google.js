const { google } = require('googleapis');
const sheets = google.sheets('v4');
const jwtClient = require('./jwtClient');

// Make sure to create a new project via console.developers.com
// Create a service account
// Download the private key
// Enable the google sheets API
// Share spreadsheet with service account
const googleConnection = (sheetName) => {
    return sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SPREADSHEETID,
        range: sheetName
    });
}

module.exports = googleConnection;