require('./vendors/jquery-global.js');

$(".floating-image").on("mouseenter", (event) => {
    const $this = $(event.currentTarget);
    const src = $this.attr("src");
    const newSrc = src.replace("-start.png", ".gif");
    const classes = $this.attr("class");

    if (/slide-up/.test(classes)) {
        $this.attr("src", newSrc);
        $this.removeClass("image");
    }
});

$(".floating-image").on("mouseleave", (event) => {
    const $this = $(event.currentTarget);
    const src = $this.attr("src");
    const newSrc = src.replace(".gif", "-start.png");
    const classes = $this.attr("class");

    if (/slide-up/.test(classes)) {
        $this.attr("src", newSrc);
        $this.addClass("image");
    }
});

// initialize position of title on page
const heroHeight = $(".hero").height();
// const titleHeight = $(".first-title").outerHeight(true);
// $(".first-title").css("top", heroHeight - titleHeight);

// Stores previous scroll position in order to detect if
// user is scrolling up or down
let originalScroll = -1;
$(window).on('scroll', () => {
    const scrollTop = $(window).scrollTop();
    const scrollBottom = $(window).scrollTop() + $(window).height();
    // const title = $(".first-title");

    // if (title.length) {
    const heroHeight = $(".hero").height();
    // const titleHeight = title.outerHeight(true);
    // const maxDisplacement = heroHeight + (titleHeight / 7);
    // const displacement = heroHeight + scrollTop - titleHeight;

    // Adjust position of first title
    // if (displacement < maxDisplacement) title.css("top", displacement);

    // Reveals nearest event elements based on scroll position
    $($('.event-image').get().reverse()).each((ix, el) => {
        const $this = $(el);
        const isGif = /gif/.test($this.attr("class"));
        const imageMidpoint = $this.position().top + ($this.height() / 2);
        if (scrollBottom > imageMidpoint) {
            let delay = isGif ? 2750 : 750;

            $this.addClass("slide-up");
            $this.siblings(".background-lines").addClass("slide-out");

            setTimeout(() => {
                $this.siblings(".btn").addClass("slide-in");
            }, delay);

            delay += 750;

            setTimeout(() => {
                $this.parents(".row").find(".details").addClass("slide-up-text");
            }, delay);

            delay += 750;

            setTimeout(() => {
                $this.parents(".row").find(".floating-image").addClass("slide-up");
            }, delay);

            return false; // Stop the .each loop from continuing if there is a match
        }
    });
    // }

    // Updates position of scroll to detect if a user is scrolling up or down
    originalScroll = scrollTop;
});

// Repositions elements on load and resize depending on user's scroll position
$(window).on("load resize", () => {
    const scrollTop = $(window).scrollTop();
    const scrollBottom = $(window).scrollTop() + $(window).height();
    // const title = $(".first-title");
    const btns = $(".btn");

    if (btns.length) {
        btns.each((ix, el) => {
            const $this = $(el);
            const classes = $this.attr("class");
            const isShare = /share/.test(classes);
            const eventImage = $this.siblings("img").width();
            // const eventImageContainer = $this.parent();
            // const columnContainer = eventImageContainer.parent().outerWidth(true);
            const containerWidth = $(".container").outerWidth(true);
            const leftMargin = (containerWidth - eventImage) / 2 + 25;
            // const gapContainer = ((columnContainer - eventImage) / 2);


            if (isShare) $this.css("right", leftMargin);
            else $this.css("left", leftMargin);
        });
    }

    // if (title.length) {
    const heroHeight = $(".hero").height();
    // const titleHeight = title.outerHeight(true);
    // const maxDisplacement = heroHeight + (titleHeight / 7);
    // const displacement = heroHeight + scrollTop - titleHeight;

    // Sets position of first title to maximum displacement if the user
    // is already scrolled past it
    // if (displacement >= maxDisplacement) title.css("top", maxDisplacement);

    // Looping through all elements and reveals those that the user has already scrolled past
    $($('.event-image').get().reverse()).each((ix, el) => {
        const $this = $(el);
        const imageMidpoint = $this.position().top + ($this.height() / 2);
        if (scrollBottom > imageMidpoint) {

            $this.addClass("slide-up");
            $this.siblings(".background-lines").addClass("slide-out");

            $this.siblings(".btn").addClass("slide-in");

            $this.parents(".row").find(".details").addClass("slide-up-text");

            $this.parents(".row").find(".floating-image").addClass("slide-up");
        }
    });
    // }

    // $('.fixed-action-btn').floatingActionButton();
});

//https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery/30905277#30905277
//https://stackoverflow.com/questions/47907503/why-is-document-execcommandcopy-no-longer-working-in-internet-explorer-11
const copyToClipboard = (text) => {
    var aux = document.createElement("div");
    aux.setAttribute("contentEditable", true);
    aux.innerHTML = text;
    document.body.appendChild(aux);
    window.getSelection().selectAllChildren(aux);
    document.execCommand("copy");
    document.body.removeChild(aux);
    console.log("COPY");
};

$(
    () => {


        $('#share-event').modal({
            onOpenStart: (modal, trigger) => {
                const $trigger = $(trigger);
                const $modal = $(modal);
                const purchaseLink = $trigger.siblings(".purchase-btn").attr("href");
                console.log(purchaseLink);

                $modal.find("#facebook").on('click', () => { window.location.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(purchaseLink); });
                $modal.find("#twitter").on('click', () => { window.location.href = "https://twitter.com/intent/tweet?text=" + encodeURI("Check out this event from It's Lit " + purchaseLink); });
                $modal.find("#mail").on('click', () => { window.location.href = "mailto:?subject=" + encodeURI("Here's an event you should check out") + "&body=" + encodeURI("Check out this event from It's Lit " + purchaseLink); });
                $modal.find("#clipboard").on('click', () => { copyToClipboard(purchaseLink); $modal.modal("close"); });
            }
        });
    }
);