'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mwl_cookie = function () {
    function mwl_cookie() {
        _classCallCheck(this, mwl_cookie);
    }

    _createClass(mwl_cookie, null, [{
        key: 'set',
        value: function set(key, val, exp) {
            var date = new Date(),
                hostname = window.location.hostname,
                domain = hostname.replace(/(www\.|ww\d\.|m\.)/ig, ''),
                dateString = new Date(date.getTime() + 86400000 * exp);

            document.cookie = key + '=' + val + '; domain=.' + domain + ' ;path=/; expires=' + dateString.toGMTString() + ';';
        }
    }, {
        key: 'get',
        value: function get(name) {
            var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            this.set(key, null, -1);
        }
    }]);

    return mwl_cookie;
}();