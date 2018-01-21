$(document).ready(function() {

    uLogin.customInit('uLoginButtons');

    $('.social-img').hover(function () {
        $('.social-img').css("opacity", '1');
    });

    $('.social-img').click(function (e) {
        e.preventDefault();
    });

    $('#email-form').on('submit', function(e) {
        e.preventDefault();
        submitForm();
    });

    $('.mail-input').focus(function () {
        $('.mail-input').removeClass('mail-input-error');
        $('.input-error-text').text('');
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
            var a = data.reduce(function(prev, curr) {
                var key = curr.name,
                    val = curr.value;
                prev[key] = val;
                return prev;
            }, {});
            return JSON.stringify(a);
        }
    }
});
