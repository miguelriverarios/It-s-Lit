require('./vendors/jquery-global.js');
const Cookies = require('js-cookie');
const { v4: uuidv4 } = require("uuid");
const uuid = Cookies.get("unique-id") ? Cookies.get("unique-id") : uuidv4();

if (!Cookies.get("unique-id")) Cookies.set("unique-id", uuid, { path: '/', expires: 1 });

const drums = $(".drums img");
const timeoutRate = 1000;
const getUrl = 'https://script.google.com/macros/s/AKfycbxsR8GIom8J4X5Zz2LE19bflzo1XSf3SVih7-ujByVzFgSEvEzFCQT4/exec';

drums.each((ix, el) => {
    setTimeout(() => {
        $(el).addClass("appear");
    }, (ix + 1) * timeoutRate)
});

setTimeout(() => {
    $(".score-and-text:not(.no-fade-in)").addClass("fade-in");
}, drums.length * timeoutRate + 1500);

$.get(getUrl + "?uuid=" + uuid, (data) => {
    const parsed = JSON.parse(data);
    const pointsExist = !!parsed.points;

    if (pointsExist) {
        $("#points").html(parsed.points);
        $("#possiblePoints").html(parsed.possiblePoints);
        $("#no-scores-found").hide();
    } else $("#scores-found").hide();

    $("#loading-overlay").slideUp(400);
});