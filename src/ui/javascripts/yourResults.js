require('./vendors/jquery-global.js');

const drums = $(".drums img");
const timeoutRate = 1000;

drums.each((ix, el) => {
    setTimeout(() => {
        $(el).addClass("appear");
    }, (ix + 1) * timeoutRate)
});

setTimeout(() => {
    $(".score-and-text:not(.no-fade-in)").addClass("fade-in");
}, drums.length * timeoutRate + 1500);
