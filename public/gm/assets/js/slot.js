'use strict';

$(document).ready(function () {

    var isPopUp = $('#popup');
    isPopUp = false;

    $('.reg-img').click(function () {
        popupShow();
        isPopUp = true;
    });

    function popupShow() {
        if (isPopUp) {
            return false;
        } else if ($(window).width() < 1000) {
            $('#popup').velocity('fadeIn', {
                duration: 450,
                complete: function complete() {
                    $('.reg-ball-left, .reg-ball-right').velocity({ opacity: 0 }, { duration: 450 });
                }
            });

            one(75);
            setTimeout(function () {
                two();
            }, 1700);
        } else if ($(window).width() > 1000) {
            $('#popup').velocity('fadeIn', {
                duration: 450,
                complete: function complete() {
                    $('.reg-ball-left, .reg-ball-right').velocity({ opacity: 0 }, { duration: 450 });
                }
            });

            one(62);
            setTimeout(function () {
                two();
            }, 1700);
        }
    }

    function one(xWidth) {
        $('.popup-reg-ball-left').animate({
            opacity: 1,
            left: xWidth + "%"
        }, 1800);
        $('.popup-reg-ball-right').animate({
            opacity: 1,
            right: xWidth + "%"
        }, 1800);
    }

    function two() {
        $('.popup-regform').animate({
            opacity: 1
        }, 800);
        $('.popup-reg-ball-right').addClass('animate-shadow-right');
        $('.popup-reg-ball-left').addClass('animate-shadow-left');
    }

    $('#email-form').on('submit', function (e) {
        e.preventDefault();
    });

    $('.email-input').focus(function () {
        $('.error-text').text('');
    });

    window.uloginAuthCb = function (token) {};
});
//# sourceMappingURL=slot.js.map
