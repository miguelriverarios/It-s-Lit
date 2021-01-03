const getKeyName = require('./getKeyName');

const matrixToObjectArray = (array, row) => {
    const header = array[0];
    const object = header.reduce((prev, curr, ix) => {
        const key = getKeyName(curr);
        const val = row[ix];

        if (key) prev[key] = val;
        return prev;
    }, {});

    return row[0] ? object : false;
}

module.exports = matrixToObjectArray;