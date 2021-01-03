const toCamelCase = (name) => {
    const words = name.split(' ');

    return words.reduce((prev, curr, ix) => {
        const lowerCase = curr.toLowerCase();

        if (ix === 0) prev += lowerCase;
        else {
            const firstLetter = lowerCase[0].toUpperCase();
            const remainder = lowerCase.slice(1);

            prev += firstLetter + remainder;
        }
        return prev;
    }, '');
}

module.exports = toCamelCase;