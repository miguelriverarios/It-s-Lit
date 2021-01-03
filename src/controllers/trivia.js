const getMinimumOptions = require('../util/getMinimumOptions');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Trivia!A:F';
const pageType = 'trivia';

const events = async (req, res) => {
    const options = await getMinimumOptions(pageType);

    try {
        const data = (await google(sheetName)).data;
        const values = data.values;
        const payload = values.slice(1).reduce((prev, curr, ix) => {
            const row = matrixToObjectArray(values, curr);

            if (row) {
                const obj = {
                    question: row.question, description: row.description, questionType: row.questionType,
                    choices: row.choices, imageLink: row.imageLink,
                    backgroundColor: row.backgroundColor
                };
                prev.push(obj);
            }

            return prev;
        }, []);

        options.payload = payload;

        console.log(options);

        res.render(pageType, options);

    } catch (err) {
        catchError(err, sheetName);
    }
}

module.exports = events;