const getMinimumOptions = require('../util/getMinimumOptions');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Reviews!A:J';
const pageType = 'reviews';

const reviews = async (req, res) => {
    const options = await getMinimumOptions(pageType);
    req = req || {};
    
    try {
        const data = (await google(sheetName)).data;
        const values = data.values;
        const payload = values.slice(1).reduce((prev, curr, ix) => {
            const row = matrixToObjectArray(values, curr);

            if (row) {
                const reasonForChoosing = row.reasonForChoosing ? row.reasonForChoosing.split(/(?:\r\n|\r|\n)/g) : '';
                const reasonForRating = row.reasonForRating ? row.reasonForRating.split(/(?:\r\n|\r|\n)/g) : '';
                const year = row.yearRead;
                const obj = {
                    book: row.book, author: row.author, year: year,
                    order: row.orderWithinYear, bookCover: row.bookCoverImageLink,
                    rating: row.rating, searchTerms: row.searchTerms,
                    reasonForChoosing: reasonForChoosing, reasonForRating: reasonForRating,
                    owner: row.owner
                };
                let columns;

                if (prev.keys.indexOf(year) === -1) {
                    columns = 11;
                    obj.columns = columns;

                    prev.keys.unshift(year);
                    prev.objects.unshift([obj]);
                } else {
                    const ix = prev.keys.indexOf(year);
                    columns = Math.floor(12 / (prev.objects[ix].length + 1));

                    obj.columns = columns;
                    prev.objects[ix].push(obj);
                }
            }

            return prev;
        }, { keys: [], objects: [] });

        payload.objects[0][payload.objects[0].length - 1].isFirst = true;

        options.payload = payload.objects;

        if (req.getDataOnly) return options;
        else res.render(pageType, options);


    } catch (err) {
        catchError(err, sheetName);
    }
}

module.exports = reviews;