const getMinimumOptions = require('../util/getMinimumOptions');
const getQueryParameter = require('../middleware/getQueryParameter');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Responses Grid!A2:G';
const pageType = 'your-results';

const trivia = async (req, res) => {
    const options = await getMinimumOptions(pageType);
    let uid;
    req = req || {};

    if (!req.getDataOnly) uid = getQueryParameter(req, "uid");

    try {
        const data = (await google(sheetName)).data;
        const values = data.values;
        const payload = values.reduce((prev, curr, ix) => {
            const row = matrixToObjectArray(values, curr);

            if (row) {
                const obj = {
                    uniqueId: row.uniqueId, email: row.emailAddress, teamName: row.teamName,
                    score: row.score, percentage: row.percentage, possiblePoints: row.possiblePoints
                };
                
                if (uid === row.uniqueId) prev.push(obj);
            }

            return prev;
        }, []);

        options.payload = {scores: payload, numScores: payload.length};

        if (req.getDataOnly) return options;
        else res.render(pageType, options);

    } catch (err) {
        catchError(err, sheetName);
    }
}

module.exports = trivia;