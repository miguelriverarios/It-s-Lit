const { google } = require('googleapis');
const sheets = google.sheets('v4');
const jwtClient = require('./jwtClient');

const googleConnection = (sheetName, resource) => {
    return sheets.spreadsheets.values.append({
        auth: jwtClient,
        spreadsheetId: process.env.SPREADSHEETID,
        range: sheetName,
        resource: resource,
        insertDataOption: "INSERT_ROWS",
        valueInputOption: "USER_ENTERED"
    });
}

module.exports = googleConnection;