$(document).ready(function () {

    $('.slider-block').slick({
        autoplay: true,
        infinite: true,
        autoplaySpeed: 1300,
        speed: 800,
        fade: true,
        cssEase: 'linear',
        pauseOnHover: false,
        mobileFirst: true,
        arrows: false
    });


    $('.menu__button').on('click', function () {
        $(this).siblings('.menu__list').slideToggle();
    });
});


