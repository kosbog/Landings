$(document).ready(function () {

    var winCounter = 0,
        $repeatButton = $('.repeat-button'),
        $popupWin = $('#popup'),
        $popupLoose = $('#popup-warning'),
        $galleryItem = $('.gallery-item'),
        $win = $('.win'),
        $loose = $('.loose');

    countDownTimer();
    randomGallerySort();

    // -------- EMAIL VALIDATION AND ULOGIN FUNCTIONS
    $('#email-form').on('submit', function (e) {
        e.preventDefault();
        submitForm();
    });

    $('.email-input').focus(function () {
        $('.email-input').removeClass('email-input-error');
        $('.error-text').text('');
    });

    function submitForm() {
        var email = $('.email-input').val();
        var emailRegExp = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
        if (!email || !email.match(emailRegExp)) {
            $('.email-input').addClass('email-input-error');
            $('.error-text').text('Enter your email. Correct format: example@gmail.com');
            return false;
        }
    }

    // ---------------- CUSTOM FUNCTIONS
    $galleryItem.on({
        'win': function () {
            $(this).addClass('right-choice');
        },
        'loose': function () {
            $(this).addClass('wrong-choice');
        },
        'cancelLoose': function () {
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
            $startNumber = $('.clock p');

        $startNumber.text("00:01:00");

        $clock.animate({ opacity: 1 }, 1750);

        var clockId = setInterval(function () {
            seconds--;

            if (seconds < 0) {
                $startNumber.removeClass('timeEnd');
                clearInterval(clockId);
                popupShow($popupLoose);
            }
            else if (winCounter === 3) {
                clearInterval(clockId);
                $startNumber.text("00:00:00");
                popupShow($popupWin);
            }
            else {
                if (seconds == 10) { $startNumber.addClass('timeEnd') };
                seconds >= 10 ? $startNumber.text("00:00:" + seconds) : $startNumber.text("00:00:0" + seconds);

            }
        }, 1000);
    }

    function popupShow(elem) {
        elem.fadeIn();
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