!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);n(1),n(3);$(document).ready(function(){var e=document.getElementById("sound-theme"),t=document.getElementById("sound-jedi"),n=document.getElementById("sound-dart"),o=10;e.play(),setTimeout(()=>{document.getElementsByClassName("name")[0].classList.add("show-element"),setTimeout(()=>{document.getElementById("email-form").classList.add("show-element")},700)},19e3);var r=setInterval(()=>{o<420?(document.getElementsByTagName("body")[0].style.backgroundPositionY=o+"px",e.volume=1-.0017*o):clearInterval(r),o++},50);uLogin.customInit("uLoginButtons"),$(".social-img").hover(function(){$(".social-img").css("opacity","1")}),$(".social-img").click(function(e){e.preventDefault()}),$("#email-form").on("submit",function(e){e.preventDefault(),function(){var e=$(".mail-input").val();if(!e||!e.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/))return $(".mail-input").addClass("mail-input-error"),$(".input-error-text").text("Введите Вашу почту. Верный формат: example@gmail.com"),!1}()}),$(".mail-input").focus(function(){$(".mail-input").removeClass("mail-input-error"),$(".input-error-text").text("")}),$(".coins-label-1").click(function(){t.play()}),$(".coins-label-2").click(function(){n.play()})})},function(e,t,n){},,function(e,t,n){}]);
//# sourceMappingURL=index.js.map