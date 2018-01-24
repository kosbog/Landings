$(document).ready(function () {

    setTimeout(function () {
        PopUpShow();
        setInterval(function () {
            PopUpShow();
        }, 240000);
    }, 120000);

    setInterval(function () {
        lightningPoint();
    }, 5500);

    $('.popup-close').click(function () {
        PopUpHide();
    });

    $('.game-button input').click(function () {

        var point = $(this).attr('id');
        if ($("input:not(:checked)")) {
            $('iframe').removeClass('js-display-show');
            $('body').removeClass('js-bg-bookOfRa, js-bg-bookOfRaDeluxe , js-bg-bookOfRa6');
        }

        function changeGameAndBG() {
            $('.' + point + '').addClass('js-display-show');
            $('body').addClass('js-bg-' + point + '');
        }

        changeGameAndBG();
    });

    $('#email-form').on('submit', function (e) {
        e.preventDefault();
        wl_shared.registerUser($('.email-input').val());
    });

    $('.email-input').focus(function () {
        $('.error-text').text('');
    });

    function PopUpShow() {
        $("#popup").fadeIn(1000);
    }

    function PopUpHide() {
        $("#popup").fadeOut(400);
    }

    function lightningPoint() {

        setTimeout(function () {
            $('.reg-button-blick, .regform-blick, .blick-1, .blick-2, .blick-3').fadeOut('slow');
        }, 1000);

        $('.reg-button-blick, .regform-blick, .blick-1, .blick-2, .blick-3').fadeIn();
    }

});
