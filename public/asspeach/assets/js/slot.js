'use strict';

$(document).ready(function () {

    var winCounter = 0,
        $repeatButton = $('.repeat-button'),
        $popupWin = $('#popup'),
        $popupLoose = $('#popup-warning'),
        $galleryItem = $('.gallery-item'),
        $win = $('.win'),
        $loose = $('.loose');

    countDownTimer();

    // -------- EMAIL VALIDATION AND ULOGIN FUNCTIONS
    $('#email-form').on('submit', function (e) {
        e.preventDefault();
        wl_shared.registerUser($('.email-input').val());
    });

    $('.email-input').focus(function () {
        $('.error-text').text('');
    });

    window.uloginAuthCb = function (token) {};

    // ---------------- CUSTOM FUNCTIONS
    $galleryItem.on({
        'win': function win() {
            $(this).addClass('right-choice');
        },
        'loose': function loose() {
            $(this).addClass('wrong-choice');
        },
        'cancelLoose': function cancelLoose() {
            $(this).removeClass('wrong-choice');
        }
    });

    $win.click(function () {
        $(this).trigger('win');
        winCounter++;
    });

    $loose.click(function () {

        if (!$(this).hasClass('wrong-choice')) {
            var $this = $(this);
            $this.trigger('loose');
            addMistakeText($this);

            setTimeout(function () {
                $this.trigger('cancelLoose');
            }, 2000);
        }
    });

    $repeatButton.click(function () {
        popupHide($popupLoose);
        randomGallerySort();
        countDownTimer();
    });

    function countDownTimer() {
        var seconds = 60,
            $clock = $('.clock'),
            startNumber = $('.clock p');

        startNumber.text("00:01:00");

        $clock.animate({ opacity: 1 }, 1750);

        var clockId = setInterval(function () {
            seconds--;

            if (seconds < 0) {
                clearInterval(clockId);
                popupShow($popupLoose);
            } else if (winCounter === 3) {
                clearInterval(clockId);
                startNumber.text("00:00:0");
                popupShow($popupWin);
            } else {
                startNumber.text("00:00:" + seconds);
            }
        }, 1000);
    }

    function popupShow(elem) {
        elem.fadeIn();
        wl_shared.postHits(true);
    }

    function popupHide(elem) {
        elem.fadeOut();
    }

    function addMistakeText(elem) {
        var element = elem;

        element.append('<p>Неверно</p>');

        setTimeout(function () {
            element.empty();
        }, 2000);
    }

    function clearWinParams() {
        $win.removeClass('right-choice');
        winCounter = 0;
    }

    function randomGallerySort() {

        var parent = $('.gallery'),
            randomNumber = 0.5;

        clearWinParams();

        function compareRandom(a, b) {
            return Math.random() - randomNumber;
        }

        $galleryItem.sort(compareRandom);

        parent.append($galleryItem);
    }
});
//# sourceMappingURL=slot.js.map
