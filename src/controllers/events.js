const getMinimumOptions = require('../util/getMinimumOptions');
const catchError = require('../util/catchError');
const matrixToObjectArray = require('../util/matrixToObjectArray');
const google = require('../middleware/google');
const sheetName = 'Events!A:H';
const pageType = 'events';
let today = new Date();

today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const events = async (req, res) => {
    const options = await getMinimumOptions(pageType);
    req = req || {};

    try {
        const data = (await google(sheetName)).data;
        const values = data.values;
        const payload = values.slice(1).reduce((prev, curr, ix) => {
            const row = matrixToObjectArray(values, curr);

            if (row) {
                const dateStr = row.date;
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                const mainImage = row.mainImage;
                const isGif = /.gif/.test(mainImage);
                const obj = {
                    date: dateStr, time: row.time,
                    title: row.title, description: row.description.split(/(?:\r\n|\r|\n)/g),
                    mainImage: mainImage, surroundingImages: row.surroundingImages.split(","),
                    purchaseLink: row.linkToPurchaseTickets, eventLink: row.linkToEvent, isGif: isGif
                };
                if (new Date(year, month, day) >= today) prev.push(obj);
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

module.exports = events;