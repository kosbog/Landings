'use strict';

$(document).ready(function () {

    var soundTheme = document.getElementById('sound-theme'),
        soundJedi = document.getElementById('sound-jedi'),
        soundDart = document.getElementById('sound-dart');

    setTimeout(function () {
        soundTheme.play();
    }, 1000);

    setTimeout(function () {

        document.getElementsByClassName('name')[0].classList.add('show-element');
        setTimeout(function () {
            document.getElementById('email-form').classList.add('show-element');
        }, 700);
    }, 19000);

    uLogin.customInit('uLoginButtons');

    $('.social-img').hover(function () {
        $('.social-img').css("opacity", '1');
    });

    $('.social-img').click(function (e) {
        e.preventDefault();
    });

    $('#email-form').on('submit', function (e) {
        e.preventDefault();
        submitForm();
    });

    $('.mail-input').focus(function () {
        $('.mail-input').removeClass('mail-input-error');
        $('.input-error-text').text('');
    });

    $('.coins-label-1').click(function () {
        soundJedi.play();
    });

    $('.coins-label-2').click(function () {
        soundDart.play();
    });

    function submitForm() {
        var email = $('.mail-input').val();
        var emailRegExp = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
        if (!email || !email.match(emailRegExp)) {
            $('.mail-input').addClass('mail-input-error');
            $('.input-error-text').text('Введите Вашу почту. Верный формат: example@gmail.com');
            return false;
        }

        function serializeForm() {
            var data = $('#email-form').serializeArray();
            data.push({
                name: "username",
                value: makeRandomStr()
            });
            var a = data.reduce(function (prev, curr) {
                var key = curr.name,
                    val = curr.value;
                prev[key] = val;
                return prev;
            }, {});
            return JSON.stringify(a);
        }
    }
});
//# sourceMappingURL=main.js.map
