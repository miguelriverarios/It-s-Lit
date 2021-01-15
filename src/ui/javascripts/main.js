require('materialize-css/dist/js/materialize.min.js');

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

$(window).on('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

// $(
//     () => {
//         $('.tabs').tabs();
//     }
// );
$(window).on('scroll', () => {
    const scroll = $(window).scrollTop();
    const chev = $(".chevron-down");

    if (scroll >= 1) {
        $(".site-header").addClass("scrolled");
        if (chev.length) chev.fadeOut();
    } else {
        $(".site-header").removeClass("scrolled");
        if (chev.length) chev.fadeIn();
    }
});



$(
    () => {
        const scroll = $(window).scrollTop();

        if (scroll >= 1) {
            $(".site-header").addClass("scrolled");
        }

        $('.sidenav').sidenav({
            edge: "right"
        });
    }
);

//const subscriptionFormFields = ['first-name', 'last-name', 'email'];
const postUrl = 'https://script.google.com/macros/s/AKfycbxsR8GIom8J4X5Zz2LE19bflzo1XSf3SVih7-ujByVzFgSEvEzFCQT4/exec';
const submitData = (event) => {
    event.preventDefault();

    const formID = event.data.formID;
    const buttonClass = event.data.buttonClass;
    const formInputClass = event.data.formInputClass;
    const postUrl = event.data.postUrl;
    const postQueryParameters = event.data.postQueryParameters;
    // const dataValueName = event.data.dataValueName;
    // const snackbarClass = event.data.snackbarClass;
    let data = {};
    // let mdcSnackbar;

    $("." + buttonClass).attr("disabled", true);
    $.each($('.' + formInputClass), (ix, element) => {
        const el = $(element);
        const key = el.attr("name");
        const type = el.attr("type");
        const val = type == "checkbox" ? el.prop("checked")
            : el.val() ? el.val()
                : el.text();

        if (val) {
            if (!data[key]) data[key] = val;
        }


        return data;
    });

    if (Object.keys(data).length !== 2) {

        M.toast({ html: 'Please make sure you\'ve filled in all details' });
        $("." + buttonClass).attr("disabled", false);
    } else if (!/@/.test(data.email)) {
        M.toast({ html: 'Please make sure you\'ve entered a valid email' });
        $("." + buttonClass).attr("disabled", false);
    } else {

        console.log(data);
        $.post(postUrl + '?' + postQueryParameters,
            data, (resp, status) => {

                $('#' + formID).trigger('reset');

                M.toast({ html: 'Thanks, we\'ll keep in touch!' });
                $("." + buttonClass).attr("disabled", false);
            }
        );
    }
}

$('.subscribe-btn').on('click',
    {
        formID: "subscription-form",
        buttonClass: "subscribe-btn",
        formInputClass: "subscription-form-input",
        postUrl: postUrl,
        postQueryParameters: "subscriptions=true"
    },
    submitData
);

$(".redirect").on("click", (event) => {
    $("#loading-overlay").slideDown(500, () => {
        const tar = $(event.currentTarget).attr("data-target");
        window.location.href = tar;
    });
});

