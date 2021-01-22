const getMinimumOptions = require('../util/getMinimumOptions');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Team!A:D';
const pageType = 'who-we-are';

const team = async (req, res) => {
    const options = await getMinimumOptions(pageType);
    req = req || {};

    try {
        const data = (await google(sheetName)).data;
        const values = data.values;
        const payload = values.slice(1).reduce((prev, curr, ix) => {
            const row = matrixToObjectArray(values, curr);

            if (row) {
                const obj = {
                    name: row.name, title: row.title, description: row.description.split(/(?:\r\n|\r|\n)/g), image: row.image
                };
                prev.push(obj);
            }

            return prev;
        }, []);

        options.payload = payload;

        if (req.getDataOnly) return options;
        else res.render(pageType, options);

    } catch (err) {
        catchError(err, sheetName);
    }
}

module.exports = team;