'use strict';

$(document).ready(function () {
  uLogin.customInit('uLoginButtons');

  var soundTheme = $('#sound-theme'),
      soundJedi = $('#sound-jedi'),
      soundDart = $('#sound-dart'),
      titleName = $('.name'),
      coinsOne = $('.coins-label-1'),
      coinsTwo = $('.coins-label-2'),
      registerForm = $('.register'),
      val = 10;

  var audioPromise = document.getElementById('sound-theme').play();

  if (audioPromise !== undefined) {
    audioPromise.then(function (_) {}).catch(function (error) {
      throw error;
    });
  };

  setTimeout(function () {
    titleName.velocity({ opacity: 1, translateY: "-300px" }, {
      easing: [0.215, 0.61, 0.355, 1],
      duration: 1200,
      complete: function complete() {
        coinsOne.velocity({ scale: [1, 0] }, {
          easing: [0.895, 0.03, 0.685, 0.22],
          duration: 1000,
          complete: function complete() {
            coinsTwo.velocity({ scale: [1, 0] }, {
              easing: [0.895, 0.03, 0.685, 0.22],
              duration: 700,
              complete: function complete() {
                registerForm.velocity({ opacity: 1, zIndex: 1 }, { duration: 1500 });
              }
            });
          }
        });
      }
    });
  }, 19000);

  var path = setInterval(function () {
    val < 420 ? (document.getElementsByTagName('body')[0].style.backgroundPositionY = val + 'px', document.getElementById('sound-theme').volume = 1 - val * 0.0017) : stopPath();
    val++;
  }, 50);

  function stopPath() {
    clearInterval(path);
  };

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
    };
  };
});
//# sourceMappingURL=main.js.map
