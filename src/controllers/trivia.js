const getMinimumOptions = require('../util/getMinimumOptions');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Trivia!A:K';
const pageType = 'trivia';

const trivia = (isRunoff) => {

    return async (req, res) => {
        const options = await getMinimumOptions(pageType);

        try {
            const data = (await google(sheetName)).data;
            const values = data.values;
            let midpointIx = 0;
            let triviaToday = false;
            const payload = values.slice(1).reduce((prev, curr, ix) => {
                const row = matrixToObjectArray(values, curr);

                if (row) {
                    const runoff = row.isRunoff == "TRUE";

                    if (row.triviaToday == "TRUE") triviaToday = row.triviaToday == "TRUE";

                    if ((isRunoff && runoff) || (!isRunoff && !runoff)) {
                        const questionType = row.questionType;
                        const choices = row.choices ? row.choices.split(",") : row.choices;
                        const obj = {
                            question: row.question, description: row.description, questionType: row.questionType,
                            choices: choices, imageLink: row.imageLink,
                            backgroundColor: row.backgroundColor, isTitlePage: row.isTitlePage == "TRUE",
                            isRunoff: runoff
                        };

                        if (questionType === 'Midpoint') midpointIx = ix;

                        prev.push(obj);
                    }
                }

                return prev;
            }, []);

            options.payload = { questions: payload, lastQuestionIx: payload.length - 1, postMidpointIx: midpointIx + 1, triviaToday: triviaToday };

            res.render(pageType, options);

        } catch (err) {
            catchError(err, sheetName);
        }
    }
}

module.exports = trivia;