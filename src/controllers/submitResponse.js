const catchError = require('../util/catchError');
const google = require('../middleware/append');
const sheetName = 'Responses';

// I think this is probably the right way to post data to google sheets
// But started losing data when I was testing and sending data too quickly
// saw net::ERR_EMPTY_RESPONSE in console, so switched to posting via webapp for now
const submit = async (req, res) => {
    const body = req.body;
    const hasValues = !!body.values;
    const rows = [];
    let row, resource;

    if (hasValues) {
        const values = JSON.parse(body.values);

        for (let key of Object.keys(values)) {

            const value = values[key];
            row = [body.timestamp, body.uuid, body.email,
            body.teamName, body.subscribed, key, value];

            rows.push(row);
        }

        resource = {
            values: rows
        };

    } else {
        row = [body.timestamp, body.uuid, body.email,
        body.teamName, body.subscribed, body.questionId, body.response];

        resource = {
            values: [
                row
            ]
        };
    }

    try {
        const response = (await google(sheetName, resource)).data;

    } catch (err) {
        catchError(err, sheetName);
    }
}

module.exports = submit;