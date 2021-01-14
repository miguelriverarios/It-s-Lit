// import jquery from 'jquery';
const jquery = require('jquery');
window.jQuery = jquery;
window.$ = jquery;
jQuery.browser = {};
(() => {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();