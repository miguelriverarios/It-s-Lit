const catchError = (err, sheetName) => {
    console.log('----------');
    console.log(`${sheetName} - the API returned an error: ${err}`);
    console.trace();
    console.log('----------');
}

module.exports = catchError;