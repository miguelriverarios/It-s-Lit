const url = require('url');
const querystring = require('querystring');

const getQueryParameter = (req, queryParameter) => {
    const rawUrl = req.url;
    const parsedUrl = url.parse(rawUrl);
    const parsedQs = querystring.parse(parsedUrl.query);
    const parameter = parsedQs[queryParameter] ? parsedQs[queryParameter] : '';

    return parameter;
}

module.exports = getQueryParameter;