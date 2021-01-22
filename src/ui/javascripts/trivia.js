require('./vendors/jquery-global.js');
require('slick-carousel'); // Using this PR of Slick to overcome passive listener warning https://github.com/nicolaskopp/slick
const Cookies = require('js-cookie');
const { v4: uuidv4 } = require("uuid");
const webappURL = 'https://script.google.com/macros/s/AKfycbxsR8GIom8J4X5Zz2LE19bflzo1XSf3SVih7-ujByVzFgSEvEzFCQT4/exec';

$(".delay-timer button").prop("disabled", true);

if (/trivia/.test(window.location.pathname)) {
    if ($(".show-footer").length === 0) {
        $("body").css("overflow", "hidden");
        $(".site-header").css("display", "none");
    }
}

// Send all cached responses on save to
// ensure we've collected everything
$(".save").on("click", () => {
    const uuid = Cookies.get("unique-id");
    const allResponses = Cookies.get("all-responses");
    const email = Cookies.get("email");
    const teamName = Cookies.get("team-name");
    const subscribed = Cookies.get("subscribed");
    const timestamp = new Date();

    const postObj = {
        uuid: uuid,
        email: email,
        teamName: teamName,
        subscribed: subscribed,
        timestamp: timestamp,
        values: allResponses
    };

    //$.post("/trivia/submit-response", postObj);
    $.post(webappURL, postObj);

    window.location.href = "/your-results?uid=" + uuid;
});

$(".back, .next").on("click", (event) => {
    const inputsExist = !!$(".active input").length;
    const $this = $(event.currentTarget);
    const classes = $this.attr("class");
    const timestamp = new Date();
    const incrementer = /next/.test(classes) ? 1 : -1;
    const id = parseInt($this.parents("section").attr("id"));
    const uuid = Cookies.get("unique-id") ? Cookies.get("unique-id") : uuidv4();
    const originalResponse = Cookies.get("original-response");
    let type = /rank/.test($(".active input").attr("class")) ? 'rank' : $(".active input").attr("type");
    let val = '';
    let email, teamName, subscribed;

    val = getValue(type, val);

    // Creates unique id cookie if it doesn't already exist
    if (!Cookies.get("unique-id")) Cookies.set("unique-id", uuid, { path: '/', expires: 1 });

    // if (!$("form").attr("action")) $("form").attr("action", "/trivia/your-results?uid=" + uuid);

    // Creates cookies for email address of submitter (always the first question)
    if (id === 0) Cookies.set("email", val, { path: '/', expires: 1 });
    // Creates cookies for team name (always the second question)
    else if (id === 1) Cookies.set("team-name", val, { path: '/', expires: 1 });
    else if (id === 2) Cookies.set("subscribed", val, { path: '/', expires: 1 });
    else {
        email = Cookies.get("email");
        teamName = Cookies.get("team-name");
        subscribed = Cookies.get("subscribed");

        if (email && teamName && subscribed && inputsExist && originalResponse !== val) {
            postObj = {
                uuid: uuid,
                email: email,
                teamName: teamName,
                subscribed: subscribed,
                timestamp: timestamp,
                values: JSON.stringify({ [id]: val })
            };

            //$.post("/trivia/submit-response", postObj);
            $.post(webappURL, postObj);

            // To be safe, storing all responses in separate cookie, so can
            // include in the final submission
            let allResponses = Cookies.get("all-responses");

            if (!allResponses) Cookies.set("all-responses", JSON.stringify({ id: val }), { path: '/', expires: 1 });

            allResponses = JSON.parse(allResponses);
            allResponses[id] = val;

            Cookies.set("all-responses", JSON.stringify(allResponses), { path: '/', expires: 1 });
        }

    }

    if (!/save/.test(classes)) {
        if (/next/.test(classes)) {
            $("#carousel").slick("slickNext");
        } else {
            $("#carousel").slick("slickPrev");
        }
    }

    $(".active").toggleClass("active inactive");
    $("#" + (id + incrementer)).toggleClass(() => {
        const disabledButtonsExist = !!$("#" + (id + incrementer) + " button:disabled").length;

        if (disabledButtonsExist) {
            setTimeout(() => $("#" + (id + incrementer) + " button:disabled").prop("disabled", false), 3000);
        }

        return "active inactive";
    });

    // Immediately capture original response on new page so can see if value changes
    type = /rank/.test($(".active input").attr("class")) ? 'rank' : $(".active input").attr("type");
    val = getValue(type, '');
    Cookies.set("original-response", val, { path: '/', expires: 1 });

});

const getValue = (type, val) => {
    switch (type) {
        case 'radio':
            val = $(".active input:checked").siblings().text();
            break;
        case 'checkbox':
            $(".active input:checked").siblings().each((ix, el) => val += (val !== '' ? ',' : '') + $(el).text());
            break;
        case 'rank':
            $(".active input").each((ix, el) => {
                const $this = $(el);
                const container = $this.parents(".rank-container");
                const label = container.find(".rank-label").text().trim();
                const num = $(el).val();
                val += ',' + num + "-" + label;
            });
            val = val.split(",").sort().toString();
            break;
        default:
            val = $(".active input").val();
    }

    return val;
}

$("#carousel").slick({
    autoplay: false,
    autoplaySpeed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    draggable: false,
    arrows: false,
    dots: false,
    accessibility: false,
    infinite: false
});

// $("body").load(() => {
//     $("#loading-overlay").slideUp();
// })
// $("#loading-overlay").slideUp();

if ($("#results").length === 0) {
    $(window).on('load', () => {
        $("#loading-overlay").slideUp(400);
    });
}