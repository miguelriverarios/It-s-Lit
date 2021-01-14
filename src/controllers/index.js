const getMinimumOptions = require('../util/getMinimumOptions');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Reviews!A:J';
const pageType = 'index';

const index = async (req, res) => {
    const options = await getMinimumOptions(pageType);

    try {
        const data = (await google(sheetName)).data;
        const values = data.values;
        const payload = values.slice(1).reduce((prev, curr, ix) => {
            const row = matrixToObjectArray(values, curr);

            if (row) {
                const reasonForChoosing = row.reasonForChoosing ? row.reasonForChoosing.split(/(?:\r\n|\r|\n)/g) : '';
                const reasonForRating = row.reasonForRating ? row.reasonForRating.split(/(?:\r\n|\r|\n)/g) : '';
                const obj = {
                    book: row.book, author: row.author, year: row.yearRead,
                    order: row.orderWithinYear, bookCover: row.bookCoverImageLink,
                    rating: row.rating, searchTerms: row.searchTerms,
                    reasonForChoosing: reasonForChoosing, reasonForRating: reasonForRating
                };
                prev.push(obj);
            }

            return prev;
        }, []);

        options.payload = payload[payload.length - 1];

        res.render(pageType, options);

    } catch (err) {
        catchError(err, sheetName);
    }
}

module.exports = index;