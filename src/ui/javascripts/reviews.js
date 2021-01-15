require('./vendors/jquery-global.js');

let st = 0;
$(window).on('scroll', () => {
    const scroll = $(window).scrollTop();
    const toc = $(".toc");
    let sep;

    if (toc.length) {
        sepRelTop = $(".separator").first().get()[0].getBoundingClientRect().top;
        sep = $(".separator").first().position().top;
        header = $(".site-header").first().get()[0].getBoundingClientRect().height;

        if (scroll < sep) toc.css("top", sepRelTop);
        else toc.css("top", header);

        $(".most-recent-book .image-banner:not(.fade-out)").addClass("fade-out");

        st = scroll;
    }

});

$(window).on("load resize", () => {
    const scroll = $(window).scrollTop();
    const toc = $(".toc");
    let top, sep, newTop;

    if (toc.length) {
        sepRelTop = $(".separator").first().get()[0].getBoundingClientRect().top;
        sep = $(".separator").first().position().top;
        header = $(".site-header").first().get()[0].getBoundingClientRect().height;
        top = parseInt(toc.css("top").replace("px", ""));
        newTop = scroll

        if (scroll < sep) toc.css("top", sepRelTop);
        else {
            toc.css("top", header);

            $(".most-recent-book .image-banner:not(.fade-out)").addClass("fade-out");
        }
    }
});

$(
    () => {
        $('#book-review').modal({
            onOpenStart: (modal, trigger) => {
                const $trigger = $(trigger);
                const $modal = $(modal);
                const choosingReason = $trigger.siblings(".reasonForChoosing").html();
                const ratingReason = $trigger.siblings(".reasonForRating").html();
                const owner = $trigger.siblings(".owner").html();
                const imgSrc = $trigger.find("img").attr("src");

                $modal.find("div:not(.modal-content)").first().html(choosingReason);
                $modal.find("div:not(.modal-content)").last().html(ratingReason);
                
                if ($trigger.siblings(".reasonForChoosing").text().trim() == "") $modal.find("h4").first().html("");
                else $modal.find("h4").first().html("Why did we choose it?");
                
                if ($trigger.siblings(".reasonForRating").text().trim() == "") $modal.find("h4").last().html("");
                else $modal.find("h4").last().html("Did we like it?");

                $modal.find("img").attr("src", imgSrc);

                $modal.find("footer").html(owner);
            }
        });

        $('.scrollspy').scrollSpy();

    }
);