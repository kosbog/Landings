$(document).ready(function () {

    $('.mail-form').on('submit', function (e) {
        e.preventDefault();
        wl_shared.registerUser($('.email').val());
    });

    $('.email').focus(function () {
        $('.email-error').text('');
        $('.email').removeClass('js-mail-visible');
    });

    window.uloginAuthCb = function (token) {
        
    };
});