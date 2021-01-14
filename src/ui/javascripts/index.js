require('./vendors/jquery-global.js');
require('slick-carousel'); // Using this PR of Slick to overcome passive listener warning https://github.com/nicolaskopp/slick

// $(() => {
//     const heros = $(".hero-home img");
//     const tagText = $(".hero-tagline-text");
//     const timeoutRate = 750;

    // heros.each((ix, el) => {
    //     setTimeout(() => {
    //         $(".hero-home-active").removeClass("hero-home-active");
    //         $(el).addClass("hero-home-active");
    //     }, (ix + 1) * timeoutRate)
    // });

// });

$(".hero-slides").on("beforeChange", () => {
    const id = parseInt($(".hero-tagline-text--selected").attr("id").split("-")[1]);
    const nextId = id + 1 === 4 ? 1 : id + 1;
    $(".hero-tagline-text--selected").removeClass("hero-tagline-text--selected");

    $("#tagline-" + nextId).addClass("hero-tagline-text--selected");
})

$(".hero-slides").slick({
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    speed: 500,
    fade: true,
    adaptiveHeight: false,
    draggable: false,
    arrows: false,
    dots: false,
    infinite: true
});