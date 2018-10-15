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
    } else {
      $('#popup').velocity('fadeIn', {
        duration: 650,
        complete: function complete() {
          $('.reg-ball-left, .reg-ball-right').velocity({ opacity: 0 }, { duration: 250 });
        }
      });

      one();
      setTimeout(function () {
        two();
      }, 1700);
    }
  }

  function one() {
    $('.popup-reg-ball-left').addClass('goLeft');
    $('.popup-reg-ball-right').addClass('goRight');
  }

  function two() {
    $('.popup-regform').animate({
      opacity: 1
    }, 1200);
  }

  $('#email-form').on('submit', function (e) {
    e.preventDefault();
    var email = $('.email-input').val();
    var emailRegExp = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
    if (!email || !email.match(emailRegExp)) {
      $('.error-text').text('Введите ваш e-mail в формате example@mail.com');
      return false;
    }
  });

  $('.email-input').focus(function () {
    $('.error-text').text('');
  });
});
//# sourceMappingURL=slot.js.map
