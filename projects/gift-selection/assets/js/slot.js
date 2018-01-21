$(document).ready(function() {
    wl_shared.init({
        projectId: 1,
        API_URL_STAT: '/api/v11/statistics/track/',
        apiUrl: '//api.pdgamedev.com'
    });

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
        var email = $('.mail-input').val(); //Вытаскиваем из поля на форме
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

        $.ajax({
            url: "//api.pdgamedev.com/api/v11/users?" + wl_shared.getParams(),
            type: "POST",
            data: serializeForm(),
            success: redirect,
            error: function(e) {
                var error = JSON.parse(e.responseText),
                    errorCode;

                try {
                    errorCode = error.error.code;
                    var validationCode = 3;

                    errorCode == validationCode ? $('.input-error-text').text(error.error.description.email) : $('.input-error-text').text(error.error.message);
                } catch (e) {}
            }
        });
    }

    function makeRandomStr() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    window.uloginAuthCb = function(token) {
        $.post("//api.pdgamedev.com/api/v11/ulogin?" + wl_shared.getParams(),
            JSON.stringify({
                token: token
            }))
            .done((response) => {
                wl_shared.trackService()
                    .track(response.data.token)
                    .then(() => redirect(response))
            })
    };

    function redirect(res) {
        if (res.data.token) {
            window.location.href = "/sapi/loginByToken?token=" + res.data.token + "&landing=true";
        }
    }
});
