const toCamelCase = require('./toCamelCase');

const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
const regex = new RegExp('[' + punctuation + ']', 'g');

const getKeyName = (name) => {
    const noPunctuation = name.toLowerCase().replace(regex, ' ').replace(/\s\s+/g, ' ').trim();
    
    return camelCase = toCamelCase(noPunctuation);
}

module.exports = getKeyName;