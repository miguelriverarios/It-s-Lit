const { google } = require('googleapis');
const sheets = google.sheets('v4');
const jwtClient = require('./jwtClient');

const googleConnection = (sheetName) => {
    return sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SPREADSHEETID,
        range: sheetName
    });
}

module.exports = googleConnection;