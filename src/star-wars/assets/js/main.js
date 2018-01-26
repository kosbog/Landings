$(document).ready(function () {

    var soundTheme = $('#sound-theme'),
        soundJedi = $('#sound-jedi'),
        soundDart = $('#sound-dart'),
        titleName = $('.name'),
        coinsOne = $('.coins-label-1'),
        coinsTwo = $('.coins-label-2'),
        registerForm = $('.register'),
        val = 10

    document.getElementById('sound-theme').play();

    setTimeout(() => {
        titleName.velocity({ opacity: 1, translateY: "-300px" },
            {
                easing: [0.215, 0.61, 0.355, 1],
                duration: 1500,
                complete: function () {
                    coinsOne.velocity({ scale: [1, 0] },
                        {
                            easing: [0.895, 0.03, 0.685, 0.22],
                            duration: 1000,
                            complete: function () {
                                coinsTwo.velocity({ scale: [1, 0] }, {
                                    easing: [0.895, 0.03, 0.685, 0.22],
                                    duration: 700,
                                    complete: function () {
                                        registerForm.velocity({ opacity: 1, zIndex: 1 }, { duration: 1500 })
                                    }
                                })
                            }
                        })
                }
            })
    }, 19000);



    var path = setInterval(() => {
        val < 420 ?
            (document.getElementsByTagName('body')[0].style.backgroundPositionY = val + 'px', document.getElementById('sound-theme').volume = (1 - (val * 0.0017)))
            : stopPath();
        val++;
    }, 50);

    function stopPath() {
        clearInterval(path);
    }

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
        document.getElementById('sound-jedi').play();
    });

    $('.coins-label-2').click(function () {
        document.getElementById('sound-dart').play();
    });

    function submitForm() {
        var email = $('.mail-input').val();
        var emailRegExp = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
        if (!email || !email.match(emailRegExp)) {
            $('.mail-input').addClass('mail-input-error');
            $('.input-error-text').text('Your email enter here...');
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
